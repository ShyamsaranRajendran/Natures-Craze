import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ShoppingBag, Plus, Minus, Trash2, Package, X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 413) {
      toast.error("Order data is too large. Please try reducing the cart size.");
    } else if (error.code === "ERR_NETWORK") {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(error.response?.data?.message || "An error occurred");
    }
    return Promise.reject(error);
  }
);

const Cart = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productQuantities, setProductQuantities] = useState({});
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    alternatePhoneNumber: "",
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cartImg, setCartImg] = useState([]);

  // Memoized cart loading function
  const loadCartAndImages = useCallback(async () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);

      const initialQuantities = {};
      storedCart.forEach((item) => {
        initialQuantities[item._id] = {
          packSize: item.prices[0]?.packSize || "",
          quantity: 1,
        };
      });
      setProductQuantities(initialQuantities);

      if (storedCart.length > 0) {
        await fetchImages(storedCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCartAndImages();
  }, [loadCartAndImages]);

  // Optimized image fetching with retry logic
  const fetchImages = async (cartItems, retryCount = 3) => {
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const ids = cartItems.map((item) => item._id);
        const response = await api.post("/prod/images", { ids });
        
        const imageMap = response.data.images.reduce((acc, item) => {
          acc[item.id] = item.image;
          return acc;
        }, {});

        setCartImg(cartItems.map((item) => imageMap[item._id] || null));
        break;
      } catch (error) {
        if (attempt === retryCount - 1) {
          console.error("Error fetching images:", error);
          toast.error("Failed to load product images");
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  };

  const handlePackSizeChange = useCallback((productId, packSize) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], packSize },
    }));
  }, []);

  const handleAddToCart = useCallback((productId) => {
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

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === productId) {
          const currentQuantity = item.quantities?.[productDetails.packSize] || 0;
          return {
            ...item,
            quantities: {
              ...item.quantities,
              [productDetails.packSize]: currentQuantity + (productDetails.quantity || 1),
            },
          };
        }
        return item;
      });

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });

    toast.success(`${product.name} (${productDetails.packSize}) added to cart`);
  }, [cart, productQuantities]);

  const handleUpdateQuantity = useCallback((productId, packSize, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === productId) {
          const currentQty = item.quantities[packSize] || 0;
          const newQty = Math.max(0, currentQty + change);

          const updatedQuantities = { ...item.quantities };
          if (newQty === 0) {
            delete updatedQuantities[packSize];
          } else {
            updatedQuantities[packSize] = newQty;
          }

          return { ...item, quantities: updatedQuantities };
        }
        return item;
      }).filter((item) => Object.keys(item.quantities || {}).length > 0);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const handleRemoveItem = useCallback((productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    toast.success("Item removed from cart");
  }, []);

  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      return total + Object.entries(item.quantities || {}).reduce((sum, [volume, qty]) => {
        const price = item.prices.find((p) => p.packSize === volume)?.price || 0;
        return sum + price * qty;
      }, 0);
    }, 0);
  }, [cart]);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckoutModal(true);
  }, [cart.length]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirmCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
  
    try {
      // Validate user details
      const { username, phoneNumber, alternatePhoneNumber, address } = userDetails;
      const phoneRegex = /^[0-9]{10}$/;
  
      if (!username || !phoneNumber || !address) {
        throw new Error("Please fill in all required fields");
      }
  
      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }
  
      if (alternatePhoneNumber && !phoneRegex.test(alternatePhoneNumber)) {
        throw new Error("Please enter a valid alternate phone number");
      }
  
      // Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }
  
      const orderItems = cart.map(({ _id, name, quantities, prices, description }) => ({
        _id, // Use _id instead of productId
        name, // Include product name
        quantities,
        prices: prices.map(({ packSize, price }) => ({ packSize, price })),
        description: description || "No description available", // Include description
      }));
      
      // Validate order items
      if (orderItems.length === 0) {
        throw new Error("Your cart is empty. Please add items to proceed.");
      }
  
  
      // Send order data to backend
      const response = await api.post("/orders/create", {
        items: orderItems,
        username,
        phoneNumber,
        alternatePhoneNumber,
        address,
      });
  
      const { razorpayOrderId, amount } = response.data;
  
      if (!razorpayOrderId || !amount) {
        throw new Error("Failed to create order");
      }
  
      // Initialize Razorpay payment
      const options = {
        key: "rzp_live_vniaz7V3nXYe0J",
        // key : "rzp_test_814EkXmD14BWDD",
        amount,
        currency: "INR",
        name: "Natures Craze",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          await handlePaymentSuccess(paymentResponse, razorpayOrderId, amount);
        },
        prefill: {
          name: username,
          contact: phoneNumber,
        },
        theme: { color: "#F37254" },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled");
            setIsProcessing(false);
          },
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Checkout failed");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse, razorpayOrderId, amount) => {
    try {
      const verificationResponse = await api.post("/orders/verify", {
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      });

      if (verificationResponse.status === 200) {
        toast.success("Payment successful!");
        setShowCheckoutModal(false);
        setCart([]);
        localStorage.removeItem("cart");
        
        navigate("/payment/paymentSuccess", {
          state: {
            message: "Payment verified successfully!",
            paymentDetails: paymentResponse,
            razorpayOrderId,
            orderDetails: amount,
          },
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/payment/paymentFailed", {
        state: {
          message: "Payment verification failed",
          error: error.message,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 lg:px-8 mt-10">
  <ToastContainer position="top-right" theme="colored" />
  {isLoading ? (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  ) : cart.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <ShoppingBag className="w-12 h-12 text-gray-400" />
      <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
      <p className="text-gray-500 text-center px-4">Add some items to your cart to continue shopping</p>
      <button
        onClick={() => navigate("/products")}
        className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
      >
        Browse Products
      </button>
    </div>
  ) : (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 px-4">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-4 relative"
            >
              <button
                onClick={() => handleRemoveItem(item._id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  {cartImg[index] ? (
                    <img
                      src={cartImg[index]}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {Object.entries(item.quantities || {}).map(([size, qty]) => {
                      const price =
                        item.prices.find((p) => p.packSize === size)?.price || 0;
                      return (
                        <div
                          key={size}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            Pack Size: {size}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item._id, size, -1)
                              }
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{qty}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item._id, size, 1)
                              }
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <span className="ml-2 text-gray-900 font-medium">
                              ₹{price * qty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <select
                      value={productQuantities[item._id]?.packSize || ""}
                      onChange={(e) =>
                        handlePackSizeChange(item._id, e.target.value)
                      }
                      className="mr-2 p-1 border rounded-md text-sm"
                    >
                      <option value="">Select Pack Size</option>
                      {item.prices.map((price) => (
                        <option key={price.packSize} value={price.packSize}>
                          {price.packSize} - ₹{price.price}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="bg-amber-500 text-white px-2 py-1 rounded-md hover:bg-amber-600 text-sm"
                    >
                      Add Pack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

{showCheckoutModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg w-full max-w-lg p-6 relative shadow-lg">
      {/* Close Button */}
      <button
        onClick={() => setShowCheckoutModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Checkout Details
      </h2>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={userDetails.username}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
            maxLength={10}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
            placeholder="Enter your phone number"
            required
          />
        </div>

        {/* Alternate Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alternate Phone Number
          </label>
          <input
            type="tel"
            name="alternatePhoneNumber"
            value={userDetails.alternatePhoneNumber}
            onChange={handleInputChange}
            maxLength={10}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900"
            placeholder="Optional alternate number"
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-amber-500 focus:ring-amber-500 text-gray-900 resize-none"
            placeholder="Enter your full address"
            required
          />
        </div>

        {/* Confirm Order Button */}
        <button
          onClick={handleConfirmCheckout}
          disabled={isProcessing}
          className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Confirm Order"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Cart;