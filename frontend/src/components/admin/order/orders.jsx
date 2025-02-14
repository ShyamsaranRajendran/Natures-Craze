import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
const backendURL = process.env.REACT_APP_BACKEND_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const navigate = useNavigate();

  // Fetch orders
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


  // Handle filtering
 const filteredOrders = orders.filter((order) => {
   const matchesSearch =
     !filters.search ||
     order.username.toLowerCase().includes(filters.search.toLowerCase()) ||
     order.order_id.slice(-4).includes(filters.search); // Search by last 4 digits of order ID

   const matchesStatus = !filters.status || order.status === filters.status;
   const matchesPaymentMethod =
     !filters.paymentMethod || order.paymentStatus === filters.paymentMethod;
   const matchesDate =
     (!filters.startDate ||
       new Date(order.createdAt) >= new Date(filters.startDate)) &&
     (!filters.endDate ||
       new Date(order.createdAt) <= new Date(filters.endDate));

   return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
 });


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
        Error fetching orders: {error}
      </div>
    );
  }

  return (
    <div className="p-4 mt-10">
            <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-4">Orders</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search by username"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded-md w-full"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="processed">Processed</option>
        </select>
        <select
          value={filters.paymentMethod}
          onChange={(e) =>
            setFilters({ ...filters, paymentMethod: e.target.value })
          }
          className="border p-2 rounded-md w-full"
        >
          <option value="">All Payment Methods</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <div>
          <label
            className="block text-sm text-gray-600 mb-1"
            htmlFor="startDate"
          >
            From
          </label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1" htmlFor="endDate">
            To
          </label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate || new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {filteredOrders.map((order) => (
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
                  ID : {order.ID}
                </h3>
              </div>

              <p className="text-sm text-gray-700 mb-1 font-medium">
                <strong>Name : </strong> {order.username}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Total :</strong>{" "}
                <span
                  className={`${
                    order.paymentStatus === "successful"
                      ? "text-green-600"
                      : order.paymentStatus === "unpaid"
                      ? "text-red-600"
                      : "text-gray-600" // Default color for other statuses
                  }`}
                >
                  ₹
                  {order.paymentStatus === "successful" ||
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
}

export default Orders;
