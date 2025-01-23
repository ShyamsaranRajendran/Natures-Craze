import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
const backendURL = process.env.REACT_APP_BACKEND_URL;

function OrderDetail() {
  const { id } = useParams(); // Get the order ID from the route params
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [status, setStatus] = useState(""); // Track status

  // Fetch single order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${backendURL}/orders/${id}`);
        setOrder(response.data);
        setStatus(response.data.status); // Set initial status
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setStatusUpdateLoading(true);
    try {
      // Send a PATCH request to update the status of the order
      const response = await axios.patch(
        `${backendURL}/orders/edit/${id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      // Check if the response contains the updated order data
      if (response.data) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: newStatus, // Update the status locally
        }));
        toast.success("Order status updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      // Show error message if something goes wrong
      toast.error(
        `Error updating status: ${err.message || err.response?.data?.message}`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error fetching order details: {error}
      </div>
    );
  }

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Order Details</h1>
      {order ? (
        <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Order ID: <span className="text-indigo-600">{order._id}</span>
            </h3>
          </div>

          {/* Customer Info */}
          <div className="mb-4">
            <p className="text-sm mb-2">
              <strong>Customer:</strong> {order.username}
            </p>
            <p className="text-sm mb-2">
              <strong>Phone:</strong> {order.phoneNumber}
            </p>
            <p className="text-sm mb-2">
              <strong>Address:</strong> {order.address}
            </p>
          </div>

          {/* Payment Info */}
          <div className="mb-4">
            <p className="text-sm mb-2">
              <strong>Total Amount:</strong>{" "}
              <span className="text-green-600">₹{order.totalAmount}</span>
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
                {order.paymentStatus === "paid" ||
                order.paymentStatus === "unpaid"
                  ? order.paymentStatus // Show payment status if paid or unpaid
                  : order.paymentStatus}
              </span>
            </p>
          </div>

          {/* Order Status */}
          <div className="mb-4">
            <p className="text-sm mb-2">
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
          </div>

          {/* Order Items */}
          <h4 className=" text-lg font-semibold">Items:</h4>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item._id}
                className="border border-gray-300 rounded-md p-2 bg-gray-50"
              >
                <p>
                  <strong>Product:</strong> {item.name}
                </p>
                <p>
                  <strong>Price:</strong> ₹{item.price} ({item.weight})
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Total:</strong> ₹{item.totalPrice}
                </p>
              </li>
            ))}
          </ul>

          {/* Order Timestamps */}
          <div className="mt-4 text-sm text-gray-700">
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Shipped At:</strong>{" "}
              {new Date(order.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Status Update Section */}
          <div className="mt-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Update Status:
            </label>
            <select
              id="status"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              value={status} // Bind the dropdown to the status state
              onChange={(e) => setStatus(e.target.value)} // Update the status state
              disabled={statusUpdateLoading}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="processed">Processed</option>
            </select>
            <button
              onClick={() => handleStatusChange(status)} // Pass the selected status
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
              disabled={statusUpdateLoading}
            >
              Update Status
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No order found.</p>
      )}
    </div>
  );
}

export default OrderDetail;
