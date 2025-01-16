import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Razorpay from "razorpay";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [packSize, setPackSize] = useState(""); // State for selected pack size
  const [quantity, setQuantity] = useState(1); // State for input quantity
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    address: "",
  }); // State for user details

  const prices = {
    "250g": 200,
    "500g": 400,
    "750g": 600,
    "1000g": 1000,
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

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
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error(
        "Failed to load Razorpay SDK. Check your internet connection."
      );
      return;
    }

    const totalAmount = calculateTotal();
    const amountInPaise = totalAmount * 100; // Convert to smallest currency unit (paise)

    const options = {
      key: "YOUR_KEY_ID", // Replace with your Razorpay Key ID
      amount: amountInPaise,
      currency: "INR",
      name: "Your Store Name",
      description: "Order Payment",
      image: "https://example.com/your_logo", // Replace with your logo URL
      prefill: {
        name: userDetails.username,
        email: "user@example.com", // Optional
        contact: userDetails.phoneNumber,
      },
      notes: {
        address: userDetails.address,
      },
      theme: {
        color: "#3399cc",
      },
      handler: function (response) {
        // Handle successful payment
        toast.success("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);

        // Optionally, create an order in your backend
        createOrder(response);
      },
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled.");
        },
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  };

  const collectUserDetails = (orderId, paymentId, signature) => {
    // Collect user details after payment
    const { username, phoneNumber, address } = userDetails;

    if (!username || !phoneNumber || !address) {
      toast.warning("Please fill in your details.");
      return;
    }

    // Proceed to create the order after collecting details
    const cartItems = cart.map((item) => {
      return {
        productId: item._id,
        quantity: item.quantity,
        packSize: packSize,
      };
    });

    // Send the order data to the backend
    createOrder({
      userId: "USER_ID", // Replace with the actual user ID
      cartItems: cartItems,
      orderId,
      paymentId,
      signature,
      username,
      phoneNumber,
      address,
    });
  };

  const createOrder = async (paymentResponse) => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "USER_ID", // Replace with actual user ID
          cartItems: cart,
          totalAmount: calculateTotal(),
          paymentDetails: paymentResponse,
          shippingDetails: userDetails,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Order created successfully!");
        // Optionally clear cart or redirect to confirmation page
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error creating order.");
    }
  };

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
    <div className="container mx-auto p-6 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-base text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto border-t border-gray-200 pt-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
              />
              {/* Product Details */}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h4>
                <div className="mt-3">
                  {/* Pack Size and Quantity Input */}
                  <div className="flex items-center space-x-3 mb-3">
                    <select
                      value={packSize}
                      onChange={(e) => setPackSize(e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="">Select Pack Size</option>
                      {Object.keys(prices).map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      className="border rounded-lg px-2 py-2 w-20 text-center text-sm text-gray-700"
                    />
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
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
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm mt-4 md:mt-0"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Total and Checkout Section */}
          <div className="flex justify-between items-center border-t border-gray-200 pt-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Total: ₹ {calculateTotal().toFixed(2)}
            </h3>
            <button
              className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
