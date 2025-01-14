import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Phone, Info, ShoppingBag } from "lucide-react";

const BottomNavigation = () => {
  return (
    <div className="relative mt-20">
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-white shadow-xl py-4 flex items-center justify-around z-10 border-t-2 border-gray-300">
        {/* Home Button */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`
          }
        >
          <Home
            className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300"
          />
          <span className="text-xs transition-colors duration-300">Home</span>
        </NavLink>

        {/* Products Button */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <ShoppingBag
            className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300"
          />
          <span className="text-xs transition-colors duration-300">Products</span>
        </NavLink>

        {/* About Button */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`
          }
        >
          <Info
            className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300"
          />
          <span className="text-xs transition-colors duration-300">About</span>
        </NavLink>

        {/* Contact Button */}
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-green-500" : "text-gray-500"
            }`
          }
        >
          <Phone
            className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300"
          />
          <span className="text-xs transition-colors duration-300">Contact</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
