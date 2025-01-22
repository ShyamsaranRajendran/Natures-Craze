import React, { useState, useEffect } from "react";
import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendURL}/orders/all`);
        setOrders(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !filters.search ||
      order.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      order._id.slice(-4).includes(filters.search);

    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentMethod =
      !filters.paymentMethod || order.paymentStatus === filters.paymentMethod;
    const matchesDate =
      (!filters.startDate ||
        Date.parse(order.createdAt) >= Date.parse(filters.startDate)) &&
      (!filters.endDate ||
        Date.parse(order.createdAt) <= Date.parse(filters.endDate));

    return (
      matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate
    );
  });

  return (
    <div className="p-3">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

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

      {/* Loading, Error, and Empty State */}
      {loading && (
        <p className="text-center text-gray-500">Loading orders...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && filteredOrders.length === 0 && (
        <p className="text-center text-gray-500">No orders found.</p>
      )}

      {/* Filtered Orders Table */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Total Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Payment Status</th>
                <th className="border px-4 py-2">Date</th>
                {/* <th className="border px-4 py-2">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">{order.username}</td>
                  <td className="border px-4 py-2">{order.phoneNumber}</td>
                  <td className="border px-4 py-2">₹{order.totalAmount}</td>
                  <td className="border px-4 py-2 capitalize">
                    {order.status}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {order.paymentStatus}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  {/* <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      View
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
