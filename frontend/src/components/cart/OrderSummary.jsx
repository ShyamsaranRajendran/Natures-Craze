// OrderSummary.js
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ total, onCheckout }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          // onClick={() =>navigate("/checkout")}
          className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;