import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary data for testing
    setTimeout(() => {
      setProducts([
        { _id: 1, name: "Product 1", price: "$50", category: "Electronics" },
        { _id: 2, name: "Product 2", price: "$30", category: "Furniture" },
        { _id: 3, name: "Product 3", price: "$20", category: "Clothing" },
      ]);
      setOrders([
        {
          _id: 1,
          orderNumber: "ORD123",
          status: "Shipped",
          createdAt: "2025-01-13T14:30:00Z",
        },
        {
          _id: 2,
          orderNumber: "ORD124",
          status: "Delivered",
          createdAt: "2025-01-11T09:45:00Z",
        },
        {
          _id: 3,
          orderNumber: "ORD125",
          status: "Processing",
          createdAt: "2025-01-10T17:00:00Z",
        },
      ]);
      setLoading(false);
    }, 1000); // Simulating an API delay
  }, []);

  const handleManageProducts = () => {
    navigate("/manage-products");
  };

  const handleManageOrders = () => {
    navigate("/manage-orders");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-20">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>

          {/* Products Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Products</h3>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product._id} className="text-gray-600">
                  {product.name} - {product.category} - {product.price}
                </li>
              ))}
            </ul>
          </div>

          {/* Orders Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Orders</h3>
            <ul className="space-y-2">
              {orders.map((order) => (
                <li key={order._id} className="text-gray-600">
                  Order #{order.orderNumber} - {order.status} (Placed on:{" "}
                  {new Date(order.createdAt).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>

          <div className="space-x-4">
            <button
              onClick={handleManageProducts}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Manage Products
            </button>
            <button
              onClick={handleManageOrders}
              className="bg-purple-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-700 transition duration-200"
            >
              Manage Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
