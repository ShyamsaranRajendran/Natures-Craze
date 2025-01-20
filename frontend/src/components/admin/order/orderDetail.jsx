import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const backendURL = process.env.REACT_APP_BACKEND_URL;

function OrderDetail() {
  const { id } = useParams(); // Get the order ID from the route params
  console.log(id);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch single order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${backendURL}/orders/${id}`);
        setOrder(response.data);
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
     await axios.patch(
       `${backendURL}/orders/edit/${id}`,
       { status: newStatus },
       { headers: { "Content-Type": "application/json" } }
     );
     setOrder((prevOrder) => ({
       ...prevOrder,
       status: newStatus,
     }));
   } catch (err) {
     alert(`Error updating status: ${err.message}`);
   } finally {
     setStatusUpdateLoading(false);
   }
 };



  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error fetching order details: {error}
      </div>
    );
  }

  return (
    <div className="p-4 mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Order Details</h1>
      {order ? (
        <div className="border border-gray-300 rounded-lg shadow-md p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Order ID: <span className="text-indigo-600">{order._id}</span>
            </h3>
          </div>
          <p className="text-sm mb-2">
            <strong>Customer:</strong> {order.username}
          </p>
          <p className="text-sm mb-2">
            <strong>Phone:</strong> {order.phoneNumber}
          </p>
          <p className="text-sm mb-2">
            <strong>Address:</strong> {order.address}
          </p>
          <p className="text-sm mb-2">
            <strong>Total Amount:</strong>{" "}
            <span className="text-green-600">₹{order.totalAmount}</span>
          </p>
          <p className="text-sm mb-4">
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

          <div className="mt-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Update Status:
            </label>
            <select
              id="status"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
              defaultValue={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusUpdateLoading}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="processed">Completed</option>
            </select>
            <button
              onClick={() => handleStatusChange(order.status)}
              className="mt-2 w-full bg-blue-500 text-white py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400"
              disabled={statusUpdateLoading}
            >
              Update Status
            </button>
          </div>

          <h4 className="mt-6 text-lg font-semibold">Items:</h4>
          <ul className="mt-2 space-y-2">
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
        </div>
      ) : (
        <p className="text-center text-gray-600">No order found.</p>
      )}
    </div>
  );
}

export default OrderDetail;
