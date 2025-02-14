import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const { totalPrice } = useSelector((state) => state.cart);
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    address: "",
  });

  // Button disable state
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  // Load Razorpay script dynamically
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

  // Handle payment process
  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const { username, phoneNumber, alternatePhoneNumber, address } = userDetails;
    const phoneRegex = /^[0-9]{10}$/; 

    if (!username || !phoneNumber || !address) {
      toast.error("Please fill in all the required fields.");
      setIsProcessing(false);
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      setIsProcessing(false);
      return;
    }

    if (alternatePhoneNumber && !phoneRegex.test(alternatePhoneNumber)) {
      toast.error("Please enter a valid 10-digit alternate phone number.");
      setIsProcessing(false);
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      toast.error("Failed to load Razorpay SDK.");
      setIsProcessing(false);
      return;
    }

    try {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error("Your cart is empty!");
        setIsProcessing(false);
        return;
      }

      const requestData = {
        Items: cartItems,
        username,
        phoneNumber,
        alternatePhoneNumber,
        address,
        amount: totalPrice * 100, 
      };

      const response = await axios.post(`${backendURL}/orders/create`, requestData);
      const { razorpayOrderId, amount } = response.data;

      const options = {
        key: "rzp_test_814EkXmD14BWDD",
        amount: amount,
        currency: "INR",
        name: "Your Shop",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (paymentResponse) {
          toast.success("Payment successful!");

          try {
            const paymentVerification = await axios.post(`${backendURL}/orders/verify`, {
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            if (paymentVerification.status === 200) {
              toast.success("Payment verified successfully!");
              navigate("/payment/paymentSuccess", {
                state: {
                  message: "Payment successful!",
                  paymentDetails: paymentResponse,
                  razorpayOrderId,
                  orderDetails: amount,
                },
              });
            } else {
              toast.error("Payment verification failed.");
              navigate("/payment/paymentFailed", {
                state: {
                  message: "Payment verification failed.",
                  error: paymentVerification.data.error,
                },
              });
            }
          } catch (error) {
            toast.error("Error verifying payment.");
            navigate("/payment/paymentFailed", {
              state: {
                message: "Error verifying payment.",
                error: error.message,
              },
            });
          }
        },
        prefill: {
          name: username,
          email: "shyam@example.com",
          contact: phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Payment failed.");
      console.error("Checkout Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p>Total Amount: ₹{totalPrice.toFixed(2)}</p>

      <div className="space-y-3">
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={userDetails.username}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={userDetails.phoneNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="alternatePhoneNumber"
          placeholder="Alternate Phone Number (Optional)"
          value={userDetails.alternatePhoneNumber}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={userDetails.address}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`bg-green-500 text-white p-2 rounded mt-4 w-full ${
          isProcessing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
