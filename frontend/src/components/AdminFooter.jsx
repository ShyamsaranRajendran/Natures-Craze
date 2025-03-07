import React from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, CheckCircle, Package, Loader2 } from "lucide-react"; // Importing icons from lucide-react

const BottomNavigation = () => {
  return (
    <div className="relative mt-20">
      <div className="fixed bottom-0 w-full bg-white shadow-xl py-4 flex items-center justify-around z-10 border-t-2 border-gray-300">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`
          }
          aria-label="Home"
        >
          <Home className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">Home</span>
        </NavLink>

        {/* Products Button */}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-red-500" : "text-gray-500"
            }`
          }
          aria-label="Products"
        >
          <ShoppingBag className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">
            Products
          </span>
        </NavLink>

        {/* Orders Button */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`
          }
          aria-label="Orders"
        >
          <Package className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">Orders</span>
        </NavLink>

        {/* Failed Orders Button */}
        <NavLink
          to="/admin/failedOrders"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-purple-500" : "text-gray-500"
            }`
          }
          aria-label="Processing"
        >
          <Loader2 className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">
            Unpaid
          </span>
        </NavLink>

        {/* Processed Button */}
        {/* <NavLink
          to="/admin/processed"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-green-500" : "text-gray-500"
            }`
          }
          aria-label="Processed"
        >
          <CheckCircle className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">
            Processed
          </span>
        </NavLink> */}
      </div>
    </div>
  );
};

export default BottomNavigation;
