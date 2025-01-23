import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProcessingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProcessingOrders = async () => {
      try {
        console.log("Fetching from URL:", `${backendURL}/orders/processing`); // Debug log
        const response = await axios.get(`${backendURL}/orders/processing`);
        setOrders(response.data);

        if (response.data.length > 0) {
          toast.success("Processing orders fetched successfully.");
        } else {
          toast.info("No processing orders found.");
        }
      } catch (err) {
        // Handle specific errors
        if (err.response && err.response.status === 404) {
          setError("Endpoint not found. Please check the backend route.");
          toast.error("Error 404: Endpoint not found.");
        } else {
          setError("Failed to fetch processing orders.");
          toast.error("Failed to fetch processing orders.");
        }
        console.error("Error details:", err); // Debug log
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingOrders();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
      </div>
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 mt-20">
            <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Processing Orders</h1>
      {orders.length === 0 ? (
        <p>No processing orders found.</p>
      ) : (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow duration-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigate(`/admin/orders/${order._id}`);
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-indigo-600">
                  ...{order._id.slice(-4)}
                </h3>
              </div>

              <p className="text-sm text-gray-700 mb-1 font-medium">
                <strong>Name : </strong> {order.username}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Total :</strong>{" "}
                <span
                  className={`${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "unpaid"
                      ? "text-red-600"
                      : "text-gray-600" // Default color for other statuses
                  }`}
                >
                  ₹
                  {order.paymentStatus === "paid" ||
                  order.paymentStatus === "unpaid"
                    ? order.totalAmount // Show total amount if status is paid or unpaid
                    : order.paymentStatus}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "processing"
                      ? "text-blue-500"
                      : "text-green-600"
                  }
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Payment:</strong>{" "}
                <span
                  className={`${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : order.paymentStatus === "unpaid"
                      ? "text-red-600"
                      : "text-gray-600" // Default color for other statuses
                  }`}
                >
                  ₹
                  {order.paymentStatus === "paid" ||
                  order.paymentStatus === "unpaid"
                    ? order.paymentStatus // Show total amount if status is paid or unpaid
                    : order.paymentStatus}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessingOrders;
