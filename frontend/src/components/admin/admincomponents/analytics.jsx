import React, { useEffect, useState } from "react";
import OrderCharts from "./OrderCharts";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Analytics = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Function to fetch order data from backend
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backendURL}/orders/charts`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <OrderCharts orders={orders} />
    </div>
  );
};

export default Analytics;
