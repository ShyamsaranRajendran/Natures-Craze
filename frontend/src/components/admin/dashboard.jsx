import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const backendURL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for order status counts from the backend API
    // const fetchOrderStatusCounts = async () => {
    //   try {
    //     const response = await axios.get(`${backendURL}/orders/order-status-count`);
    //     setOrderStatusCounts(response.data);
    //   } catch (error) {
    //     console.error("Error fetching order status counts:", error);
    //   }
    // };

    // Fetch temporary products data (can be replaced with real API)
    setTimeout(() => {
      setProducts([
        { _id: 1, name: "Product 1", price: 50, category: "Electronics" },
        { _id: 2, name: "Product 2", price: 30, category: "Furniture" },
        { _id: 3, name: "Product 3", price: 20, category: "Clothing" },
      ]);
      // fetchOrderStatusCounts();
      setLoading(false);
    }, 1000); // Simulating an API delay
  }, []);

  const handleManageOrders = () => {
    navigate("/admin/orders");
  };

  // Data for Price Chart
  const productNames = products.map((product) => product.name);
  const productPrices = products.map((product) => product.price);
  const chartData = {
    labels: productNames,
    datasets: [
      {
        label: "Product Prices",
        data: productPrices,
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        borderColor: "#ddd",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Product Prices Chart",
      },
    },
  };

  // Color mapping for order status
  const statusColorMap = {
    processing: "#ff9800",
    pending: "#2196f3",
    processed: "#4caf50",
    paid: "#4caf50",
    unpaid: "#f44336",
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

          {/* Price Chart Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">Price Chart</h3>
            <div className="mt-4">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Orders Status Count Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderStatusCounts.map((statusItem) => (
              <div
                key={statusItem.status}
                className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: statusColorMap[statusItem.status],
                    }}
                  >
                    <span className="text-white font-semibold">
                      {statusItem.status[0].toUpperCase()}
                    </span>
                  </div>
                  <h4 className="ml-4 text-lg font-semibold text-gray-800 capitalize">
                    {statusItem.status}
                  </h4>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {statusItem.count}
                </div>
              </div>
            ))}
          </div>

          <div className="space-x-4">
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
