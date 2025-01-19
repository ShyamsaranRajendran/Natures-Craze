import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, paymentDetails, error } = location.state || {};

  useEffect(() => {
    // Redirect if state data is missing
    if (!location.state) {
      navigate("/", { replace: true }); // Replace ensures no back navigation to this route
    }
  }, [location.state, navigate]);

  if (!location.state) return null; // Render nothing during redirect

  return (
    <div className="mt-20"> 
      <h1>Payment Failed</h1>
      <p>{message}</p>
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      <h2>Payment Details:</h2>
      <pre>{JSON.stringify(paymentDetails, null, 2)}</pre>
    </div>
  );
};

export default PaymentFailed;
