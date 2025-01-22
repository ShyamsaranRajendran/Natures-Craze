import React, { useState, useEffect } from "react";
import Orders from "./admincomponents/orders";
import Products from "./admincomponents/products";

const Dashboard = () => {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Simulate loading delay for Products
    const loadProducts = setTimeout(() => {
      setLoadingProducts(false);
    }, 1000);

    // Simulate loading delay for Orders
    const loadOrders = setTimeout(() => {
      setLoadingOrders(false);
    }, 1500);

    // Cleanup timeouts when the component unmounts
    return () => {
      clearTimeout(loadProducts);
      clearTimeout(loadOrders);
    };
  }, []);

  return (
    <div>
      {/* Products Section */}
      {loadingProducts ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <div
            className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
            aria-label="Loading..."
          ></div>
        </div>
      ) : (
        <Products />
      )}

      <br />

      {/* Orders Section */}
      {loadingOrders ? (
        <div className="flex items-center justify-center h-screen bg-white">
          <div
            className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
            aria-label="Loading..."
          ></div>
        </div>
      ) : (
        <Orders />
      )}
    </div>
  );
};

export default Dashboard;
