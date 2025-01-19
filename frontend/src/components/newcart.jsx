import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Razorpay from "razorpay";

const backendURL = process.env.REACT_APP_BACKEND_URL;
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [packSize, setPackSize] = useState(""); // State for selected pack size
  const [quantity, setQuantity] = useState(1); // State for input quantity
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    address: "",
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const prices = {
    "250g": 200,
    "500g": 400,
    "750g": 600,
    "1000g": 1000,
  };
  const [cartImg, setCartImg] = useState([]);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        // Retrieve cart from local storage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        // Extract product IDs from the stored cart
        const prodIds = storedCart.map((item) => item._id);

        if (prodIds.length === 0) {
          console.warn("No product IDs found in the cart");
          return;
        }

        // Fetch images from the backend
        const response = await fetch(`${backendURL}/prod/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: prodIds }),
        });

        if (response.ok) {
          const data = await response.json();
          setCartImg(data.images);
        } else {
          console.error(
            "Error fetching product images:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error while fetching product images:", error);
      }
    };

    fetchProductImages();
  }, [backendURL]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddToCart = (productId) => {
    if (!packSize || quantity <= 0) {
      toast.warning("Please select a valid pack size and quantity.");
      return;
    }

    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const updatedQuantities = {
          ...item.quantities,
          [packSize]: (item.quantities?.[packSize] || 0) + quantity,
        };

        return { ...item, quantities: updatedQuantities };
      }
      return item;
    });

    updateCart(updatedCart);
    toast.success(`${quantity} packs of ${packSize} added to cart!`);
    setPackSize("");
    setQuantity(1);
  };

  const handleCheckout = async () => {
    setShowCheckoutModal(true);
  };
  const handleConfirmCheckout = async () => {
    const { username, phoneNumber, address } = userDetails;

    // Check if required details are present
    if (!username || !phoneNumber || !address) {
      alert("Please fill in all the details!");
      return;
    }

    // Load Razorpay script if not already loaded
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay SDK.");
      return;
    }

    try {
      // Get cart items from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Prepare request data
      const requestData = {
        Items: cartItems,
        username: username,
        phoneNumber: phoneNumber,
        address: address,
      };

      // Create order from backend
      const response = await axios.post(
        `${backendURL}/orders/create`,
        requestData
      );

      // Ensure Razorpay order details are present
      if (
        !response.data ||
        !response.data.razorpayOrderId ||
        !response.data.amount
      ) {
        throw new Error("Failed to create order. Please try again.");
      }

      const { razorpayOrderId, amount } = response.data;
      // Razorpay payment options
      const options = {
        key: "rzp_test_814EkXmD14BWDD", // Use your Razorpay key (replace for production)
        amount: amount, // Amount from the backend
        currency: "INR",
        name: "Your Store Name",
        description: "Order Payment",
        order_id: razorpayOrderId, // Order ID from the backend
        handler: async function (paymentResponse) {
          toast.success("Payment successful!");

          try {
            // Send payment details to backend for verification
            const paymentVerificationResponse = await axios.post(
              `${backendURL}/orders/verify`,
              {
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  "Content-Type": "application/json", // Ensure JSON data is sent
                },
              }
            );
            // Handle verification response from backend
            if (paymentVerificationResponse.status === 200) {
              toast.success("Payment verified successfully!");
              setShowCheckoutModal(false);
            } else {
              toast.error("Payment verification failed.");
              console.error(
                "Backend Response:",
                paymentVerificationResponse.data
              );
            }
          } catch (verificationError) {
            // Log and show error to the user
            toast.error("Payment verification failed.");
            console.error("Verification Error:", verificationError);
          }
        },
        prefill: {
          name: username || "John Doe", // Replace with actual username
          contact: phoneNumber || "9999999999", // Replace with actual phone number
          email: userDetails.email || "user@example.com", // Replace with actual email
        },
        theme: {
          color: "#F37254", // Customize with your brand color
        },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled.");
          },
        },
      };

      // Open Razorpay payment gateway
      const razorpay = new window.Razorpay(options);
      // const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "Checkout failed.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // const createOrder = async (paymentResponse) => {
  //   try {
  //     const response = await fetch(`${backendURL}/orders/create`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: "USER_ID", // Replace with actual user ID
  //         cartItems: cart,
  //         totalAmount: calculateTotal(),
  //         paymentDetails: paymentResponse,
  //         shippingDetails: userDetails,
  //       }),
  //     });

  //     const result = await response.json();
  //     if (response.ok) {
  //       toast.success("Order created successfully!");
  //       // Optionally clear cart or redirect to confirmation page
  //       setCart([]);
  //       localStorage.removeItem("cart");
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch (error) {
  //     toast.error("Error creating order.");
  //   }
  // };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    updateCart(updatedCart);
    toast.success("Item removed from cart!");
  };

  const handleQuantityChange = (productId, volume, change) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const updatedQuantities = { ...item.quantities };
        const newQuantity = (updatedQuantities[volume] || 0) + change;

        if (newQuantity <= 0) {
          delete updatedQuantities[volume];
        } else {
          updatedQuantities[volume] = newQuantity;
        }

        return { ...item, quantities: updatedQuantities };
      }
      return item;
    });

    updateCart(
      updatedCart.filter(
        (item) => Object.keys(item.quantities || {}).length > 0
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = Object.entries(item.quantities || {}).reduce(
        (sum, [volume, qty]) => sum + prices[volume] * qty,
        0
      );
      return total + itemTotal;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-base text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto border-t border-gray-200 pt-4">
          {cart.map((item, index) => (
            <div
              key={item._id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-col sm:flex-row items-center sm:items-center justify-between"
            >
              {/* Product Image */}
              {cartImg[index] && (
                <img
                  src={cartImg[index]}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
                />
              )}
              {/* Product Details */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="mt-3">
                  {/* Pack Size and Quantity Input */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mb-3">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      {/* Pack Size */}
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <label
                          htmlFor="Packsize"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pack Size:
                        </label>
                        <select
                          id="Packsize"
                          value={packSize}
                          onChange={(e) => setPackSize(e.target.value)}
                          className="w-full sm:w-40 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="" disabled>
                            Select Pack Size
                          </option>
                          {Object.keys(prices).map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <label
                          htmlFor="qty"
                          className="text-sm font-medium text-gray-700"
                        >
                          Quantity:
                        </label>
                        <input
                          id="qty"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          min="1"
                          className="w-full sm:w-40 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm w-full sm:w-auto"
                    >
                      Add
                    </button>
                  </div>
                  {/* Quantities Display */}
                  {Object.entries(item.quantities || {}).map(
                    ([volume, qty]) => (
                      <div
                        key={volume}
                        className="flex items-center justify-between text-sm text-gray-700 mb-2"
                      >
                        <p>
                          {volume} x {qty} = ₹{prices[volume] * qty}
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, volume, 1)
                            }
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, volume, -1)
                            }
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm mt-4 sm:mt-0"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Total and Checkout Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-4 space-y-4 sm:space-y-0">
            <h3 className="text-xl font-semibold text-gray-800">
              Total: ₹ {calculateTotal().toFixed(2)}
            </h3>
            <button
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Your Details
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                value={userDetails.username}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full border px-3 py-2 rounded-lg text-gray-700"
              />
              <input
                type="text"
                name="phoneNumber"
                value={userDetails.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full border px-3 py-2 rounded-lg text-gray-700"
              />
              <textarea
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full border px-3 py-2 rounded-lg text-gray-700"
                rows="3"
              ></textarea>
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCheckout}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Confirm & Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;



