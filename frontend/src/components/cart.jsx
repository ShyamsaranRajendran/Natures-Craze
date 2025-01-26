import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Razorpay from "razorpay";
import { ShoppingBag, Plus, Minus, Trash2, Package, X } from "lucide-react";
import Credits from "./Credits";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [packSize, setPackSize] = useState(""); // State for selected pack size
  const [quantity, setQuantity] = useState(1); // State for input quantity
  const [productQuantities, setProductQuantities] = useState({});
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    alternatePhoneNumber: "", // Added alternate phone number
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cartImg, setCartImg] = useState([]);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        // Retrieve cart from local storage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);

        const initialQuantities = {};
        storedCart.forEach((item) => {
          initialQuantities[item._id] = {
            packSize: item.prices[0].packSize,
            quantity: item.quantities[item.prices[0].packSize] || 1,
          };
        });
        setProductQuantities(initialQuantities);
               console.log(initialQuantities);

        // Extract product IDs from the stored cart
        const prodIds = storedCart.map((item) => item._id);

        if (prodIds.length === 0) {
          console.warn("No product IDs found in the cart");
          return;
        }

        // Fetch images from the backend
        // const response = await fetch(`${backendURL}/prod/images`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ ids: prodIds }),
        // });

        // if (response.ok) {
        //   const data = await response.json();
        //   setCartImg(data.images);
        // } else {
        //   console.error(
        //     "Error fetching product images:",
        //     response.status,
        //     response.statusText
        //   );
        // }
      } catch (error) {
        console.error("Error while fetching product images:", error);
      }
    };

    fetchProductImages();
  }, [backendURL]);

  useEffect(() => {
    // Fetch images when the cart is updated
    if (cart.length > 0) {
      const fetchImages = async () => {
        try {
          const ids = cart.map((item) => item._id); // Extract product IDs
          const response = await fetch(`${backendURL}/prod/images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }), // Send product IDs to backend
          });

          if (!response.ok) {
            throw new Error("Failed to fetch images");
          }

          const data = await response.json();

          // Create a mapping of ID -> Image
          const imageMap = data.images.reduce((acc, item) => {
            acc[item.id] = item.image; // Map product ID to base64 image
            return acc;
          }, {});

          // Set cartImg array in the order of the cart
          const images = cart.map((item) => imageMap[item._id] || null); // Default to null if no image
          setCartImg(images);
        } catch (error) {
          console.error("Error fetching images:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchImages();
    }
  }, [cart]);

  const handlePackSizeChange = (productId, packSize) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        packSize,
      },
    }));
  };
 const calculateItemTotal = (item, packSize, quantity) => {
   const price = item.prices.find((p) => p.packSize === packSize)?.price || 0;
   return price * quantity;
 };

  const handleQuantityChange = (productId, change) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, (prev[productId]?.quantity || 1) + change),
      },
    }));

    // const updatedCart = cart.map((item) => {
    
  };

  

  // const handleQuantityChange = (productId, volume, change) => {
  //   const updatedCart = cart.map((item) => {
  //     if (item._id === productId) {
  //       const updatedQuantities = { ...item.quantities };
  //       const newQuantity = (updatedQuantities[volume] || 0) + change;

  //       if (newQuantity <= 0) {
  //         delete updatedQuantities[volume];
  //       } else {
  //         updatedQuantities[volume] = newQuantity;
  //       }

  //       return { ...item, quantities: updatedQuantities };
  //     }
  //     return item;
  //   });

  //   updateCart(
  //     updatedCart.filter(
  //       (item) => Object.keys(item.quantities || {}).length > 0
  //     )
  //   );
  // };

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
   const productDetails = productQuantities[productId];
   const product = cart.find((item) => item._id === productId);

   if (!productDetails?.packSize) {
     toast.warning("Please select a pack size");
     return;
   }

   const price = product.prices.find(
     (p) => p.packSize === productDetails.packSize
   )?.price;
   if (!price) {
     toast.error("Price not found for selected pack size");
     return;
   }

   const updatedCart = cart.map((item) => {
     if (item._id === productId) {
      console.log(productDetails)
       const currentQuantity = item.quantities?.[productDetails.packSize] || 0;
       return {
         ...item,
         quantities: {
           ...item.quantities,
           [productDetails.packSize]:
             currentQuantity + (productDetails.quantity || 1),
         },
       };
     }
     return item;
   });

   updateCart(updatedCart);
   toast.success(
     `${productDetails.quantity} ${productDetails.packSize} added to cart`
   );
 };


  const handleCheckout = async () => {
    setShowCheckoutModal(true);
  };
  const handleConfirmCheckout = async () => {
    const { username, phoneNumber, alternatePhoneNumber, address } =
      userDetails;
    const phoneRegex = /^[0-9]{10}$/; // Regex to check 10 digits

    if (!phoneRegex.test(userDetails.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (
      userDetails.alternatePhoneNumber &&
      !phoneRegex.test(userDetails.alternatePhoneNumber)
    ) {
      alert("Please enter a valid 10-digit alternate phone number.");
      return;
    }
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
      console.log(cartItems);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Prepare request data
      const requestData = {
        Items: cartItems,
        username: username,
        phoneNumber: phoneNumber,
        alternatePhoneNumber: alternatePhoneNumber,
        address: address,
      };
      console.log(requestData);
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
        key: "rzp_live_vniaz7V3nXYe0J", // Use your Razorpay key (replace for production)
        amount: amount, // Amount from the backend
        currency: "INR",
        name: "Natures Craze",
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

              // Navigate to paymentSuccess with data
              navigate("/payment/paymentSuccess", {
                state: {
                  message: "Payment verified successfully!",
                  paymentDetails: paymentResponse,
                  razorpayOrderId: razorpayOrderId,
                  orderDetails: amount, // Assuming backend returns order details
                },
              });
            } else {
              toast.error("Payment verification failed.");

              // Navigate to paymentFailed with error data
              navigate("/payment/paymentFailed", {
                state: {
                  message: "Payment verification failed.",
                  paymentDetails: paymentResponse,
                  error: paymentVerificationResponse.data.error, // Assuming backend provides error details
                },
              });
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            toast.error("An error occurred during payment verification.");
            navigate("/payment/paymentFailed", {
              state: {
                message: "An error occurred during payment verification.",
                error: error.message,
              },
            });
          }
        },
        prefill: {
          name: username || "John Doe", // Replace with actual username
          contact: phoneNumber || "9999999999", // Replace with actual phone number
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

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    updateCart(updatedCart);
    toast.success("Item removed from cart!");
                  window.location.reload();

  };

  // const handleQuantityChange = (productId, volume, change) => {
  //   const updatedCart = cart.map((item) => {
  //     if (item._id === productId) {
  //       const updatedQuantities = { ...item.quantities };
  //       const newQuantity = (updatedQuantities[volume] || 0) + change;

  //       if (newQuantity <= 0) {
  //         delete updatedQuantities[volume];
  //       } else {
  //         updatedQuantities[volume] = newQuantity;
  //       }

  //       return { ...item, quantities: updatedQuantities };
  //     }
  //     return item;
  //   });

  //   updateCart(
  //     updatedCart.filter(
  //       (item) => Object.keys(item.quantities || {}).length > 0
  //     )
  //   );
  // };

  const handleUpdateQuantity = (productId, packSize, change) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId) {
        const currentQty = item.quantities[packSize] || 0;
        const newQty = Math.max(0, currentQty + change);

        const updatedQuantities = { ...item.quantities };
        if (newQty === 0) {
          delete updatedQuantities[packSize];
          window.location.reload();
        } else {
          updatedQuantities[packSize] = newQty;
        }

        return {
          ...item,
          quantities: updatedQuantities,
        };
      }
      return item;
    });

    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = Object.entries(item.quantities || {}).reduce(
        (sum, [volume, qty]) => {
          const price =
            item.prices.find((price) => price.packSize === volume)?.price || 0;
          return sum + price * qty;
        },
        0
      );
      return total + itemTotal;
    }, 0);
  };

  return (
    <div className="">
      <ToastContainer position="top-right" theme="colored" />

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-3 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <ShoppingBag className="w-8 h-8 text-amber-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-amber-600" />
              </div>
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="p-6 md:flex">
                    {/* Product Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-auto md:aspect-square mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                      <div className="absolute inset-0  from-amber-100/50 to-amber-50/30 rounded-lg"></div>
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={
                            cartImg[index] ||
                            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pack Size and Quantity Selection */}
                      <div className="bg-amber-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <Package className="w-4 h-4 mr-1" />
                              Pack Size
                            </label>
                            <select
                              value={
                                productQuantities[item._id]?.packSize || ""
                              }
                              onChange={(e) =>
                                handlePackSizeChange(item._id, e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 bg-white"
                            >
                              <option value="">Select Size</option>
                              {item.prices.map((price) => (
                                <option key={price._id} value={price.packSize}>
                                  {price.packSize} - ₹{price.price}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() =>
                                setQuantity(Math.max(1, quantity - 1))
                              }
                              className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div> */}
                        </div>

                        <div className="w-full flex justify-center mt-8">
                          <button
                            onClick={() => handleAddToCart(item._id)}
                            className=" mt-4 px-6 py-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors flex flex-row items-center justify-center"
                            //  className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      {/* Current Quantities */}
                      {Object.entries(item.quantities || {}).map(
                        ([volume, qty]) => (
                          <div
                            key={volume}
                            className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0"
                          >
                            <div>
                              <span className="font-medium text-gray-900">
                                {volume}
                              </span>
                              <span className="text-gray-600"> × {qty}</span>
                              <span className="ml-2 text-amber-600 font-medium">
                                ₹
                                {item.prices.find(
                                  (price) => price.packSize === volume
                                )?.price * qty || 0}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item._id, volume, 1)
                                }
                                className="p-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item._id, volume, -1)
                                }
                                className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Summary */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{calculateTotal().toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="ml-2 px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Checkout Details
                </h3>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userDetails.username}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userDetails.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternatePhoneNumber"
                    value={userDetails.alternatePhoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter alternate phone number"
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  ></textarea>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleConfirmCheckout}
                  className="w-full py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Credits />
    </div>
  );
};

export default Cart;
