import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PDFDocument, StandardFonts } from "pdf-lib"; // Import from pdf-lib

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
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentDetails, navigate]);

  const generateReceipt = async (order) => {
    const { order_id, username, totalAmount, createdAt, items } = order;

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);

    const page = doc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    page.drawText(`Order ID: ${order_id}`, {
      x: 50,
      y: height - 50,
      font,
      size: 14,
    });
    page.drawText(`Customer: ${username}`, {
      x: 50,
      y: height - 70,
      font,
      size: 12,
    });
    page.drawText(`Total Amount: ${totalAmount}`, {
      x: 50,
      y: height - 90,
      font,
      size: 12,
    });
    page.drawText(`Date: ${new Date(createdAt).toLocaleDateString()}`, {
      x: 50,
      y: height - 110,
      font,
      size: 12,
    });

    let yPosition = height - 130;
    items.forEach((item) => {
      page.drawText(
        `${item.name} (${item.weight}) x${item.quantity} = ${item.totalPrice}`,
        {
          x: 50,
          y: yPosition,
          font,
          size: 12,
        }
      );
      yPosition -= 20;
    });

    page.drawText(`Payment Status: ${order.paymentStatus}`, {
      x: 50,
      y: yPosition - 10,
      font,
      size: 12,
    });

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `e-receipt-${order_id}.pdf`;
    a.click();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 mt-20">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        {/* Back Button and Title */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
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
          <h1 className="text-xl font-semibold text-gray-800">Payment</h1>
        </div>

        {/* Success Icon */}
        <div className="rounded-full bg-green-500 h-24 w-24 flex items-center justify-center mb-6 mx-auto">
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

        {/* Order Details */}
        <div className="space-y-4">
          <p className="font-medium text-gray-700">
            Order ID: {orderData.order_id}
          </p>
          <p className="font-medium text-gray-700">
            Customer: {orderData.username}
          </p>
          <p className="font-medium text-gray-700">
            Total Amount: {orderData.totalAmount}
          </p>
          <p className="font-medium text-gray-700">
            Payment Status: {orderData.paymentStatus}
          </p>
          <p className="font-medium text-gray-700">
            Date: {new Date(orderData.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Items:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {orderData.items.map((item, index) => (
                <li key={index} className="text-gray-600">
                  {item.name} ({item.weight}) x{item.quantity} ={" "}
                  {item.totalPrice}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => generateReceipt(orderData)}
            className="w-full py-3 text-white bg-green-500 rounded-lg font-medium hover:bg-green-600 mt-6"
          >
            Download E-Receipt
          </button>
          <p className="flex flex-row justify-center items-center font-small">Take a screenshot</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
