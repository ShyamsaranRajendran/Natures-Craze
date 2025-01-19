import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProcessingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-4">Processing Orders</h1>
      {orders.length === 0 ? (
        <p>No processing orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white mb-4"
            >
              <h3 className="text-lg font-semibold mb-4">
                Order ID:{" "}
                <span className="text-indigo-600">
                  ...{order._id.slice(-4)}
                </span>
              </h3>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Customer Name:</strong> {order.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Phone Number:</strong> {order.phoneNumber || "N/A"}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Address:</strong> {order.address || "N/A"}
              </p>

              <div className="mt-4">
                <strong>Items:</strong>
                <ul className="list-disc ml-6 mt-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <li key={item._id} className="text-gray-700">
                        <span className="font-medium">{item.name}</span> -{" "}
                        <span>
                          {item.weight}, {item.quantity} x ₹
                          {item.price.toFixed(2)}
                        </span>{" "}
                        ={" "}
                        <span className="font-bold">
                          ₹{item.totalPrice.toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No items in this order.</li>
                  )}
                </ul>
              </div>

              <p className="text-sm text-gray-700 mt-2">
                <strong>Total Amount:</strong>{" "}
                <span className="text-green-600 font-bold">
                  ₹{order.totalAmount}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Payment Status:</strong> {order.paymentStatus || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    order.status === "processing"
                      ? "text-blue-500"
                      : "text-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Created At:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessingOrders;
