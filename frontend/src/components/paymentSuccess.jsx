import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentDetails } = location.state || {};
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paymentDetails) {
      navigate("/", { replace: true });
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/orders/id/${paymentDetails.razorpay_order_id}`
        );
        setOrderData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch order details. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentDetails, navigate]);

  const generateReceipt = async (order) => {
    try {
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Order Invoice", 105, 20, { align: "center" });

      // Order Details Section
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const startY = 40;
      let y = startY;

      const addText = (text) => {
        doc.text(text, 20, y);
        y += 10;
      };

      addText(`Order ID: ${order.order_id}`);
      addText(`Customer Name: ${order.username}`);
      addText(`Phone Number: ${order.phoneNumber}`);
      addText(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      addText(`Payment Status: ${order.paymentStatus}`);
      y += 10;

      // Items Section
      doc.setFont("helvetica", "bold");
      doc.text("Items Purchased:", 20, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      order.items.forEach((item, index) => {
        addText(`${index + 1}. ${item.name} (${item.weight})  ${item.price} x${item.quantity} = ${item.quantity * item.price}`);
      });
      y += 10;

      // Total Amount
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: ${order.totalAmount}`, 20, y);

      // Save PDF
      doc.save(`order-invoice-${order.order_id}.pdf`);
    } catch (err) {
      alert("Failed to generate the receipt. Please try again.");
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
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
          Back to Home
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-500 h-24 w-24 flex items-center justify-center">
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
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-center text-gray-800">Payment Successful!</h2>
        <p className="text-gray-500 text-center mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <div className="space-y-4">
          <p className="font-medium text-gray-700">Order ID: {orderData.order_id}</p>
          <p className="font-medium text-gray-700">Customer: {orderData.username}</p>
          <p className="font-medium text-gray-700">Total Amount: ₹{orderData.totalAmount}</p>
          <p className="font-medium text-gray-700">Payment Status: {orderData.paymentStatus}</p>
          <p className="font-medium text-gray-700">
            Date: {new Date(orderData.createdAt).toLocaleDateString()}
          </p>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-lg">Items:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {orderData.items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.name} ({item.weight})  {item.price} x{item.quantity}  = ₹{item.totalPrice}
                </li>
              ))}
            </ul>
          </div>

          {/* Download Button */}
          <button
            onClick={() => generateReceipt(orderData)}
            className="w-full py-3 text-white bg-green-500 rounded-lg font-medium hover:bg-green-600 mt-6"
          >
            Download E-Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
