import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, paymentDetails, orderDetails } = location.state || {};

  useEffect(() => {
    // Redirect if state data is missing
    if (!location.state) {
      navigate("/", { replace: true }); // Replace ensures no back navigation to this route
    }
  }, [location.state, navigate]);

  if (!location.state) return null; // Render nothing during redirect

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 mt-20">
      {/* Back Button and Title */}
      <div className="w-full max-w-sm flex items-center mb-6">
        <button className="text-gray-600 hover:text-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-center flex-grow">Payment</h1>
      </div>

      {/* Success Icon */}
      <div className="rounded-full bg-brown-500 h-24 w-24 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        Payment Successful!
      </h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        Thank you for your purchase.
      </p>

      {/* Buttons */}
      <div className="w-full max-w-sm">
        <p>{orderDetails}</p>
        <button className="w-full py-3 text-brown-500 border border-brown-500 rounded-lg font-medium hover:bg-brown-100">
          View E-Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
