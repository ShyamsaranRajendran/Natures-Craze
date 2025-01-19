import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendURL}/orders/all`);
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await axios.patch(`${backendURL}/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error fetching orders: {error}
      </div>
    );
  }

  return (
    <div className="p-4 mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders available.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Order ID:{" "}
                  <span className="text-indigo-600">
                    ...{order._id.slice(-4)}
                  </span>
                </h3>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="text-blue-500 text-sm"
                >
                  View Details
                </button>
              </div>

              <p className="text-sm mb-2">
                <strong>Username:</strong> {order.username}
              </p>
              <p className="text-sm mb-2">
                <strong>Total Amount:</strong>{" "}
                <span className="text-green-600">₹{order.totalAmount}</span>
              </p>
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

              <div className="mt-2">
                <label
                  htmlFor={`status-${order._id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Update Status:
                </label>
                <select
                  id={`status-${order._id}`}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                  defaultValue={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  disabled={statusUpdateLoading}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => handleStatusChange(order._id, order.status)}
                  className="mt-2 w-full bg-blue-500 text-white py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
                  disabled={statusUpdateLoading}
                >
                  Change Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
