// OrderSummary.js
import React from "react";

const OrderSummary = ({ calculateTotal, handleCheckout }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h2>
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
  );
};

export default OrderSummary;