import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Home, Phone, Info, ShoppingBag, ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext"; // Import CartContext
import Credits from "./Credits";
const BottomNavigation = () => {
  const { cart } = useContext(CartContext); // Get cart from context

  return (
    <div className="relative mt-15">
       <Credits />
      <div className="fixed bottom-0 w-full bg-white shadow-xl py-4 flex items-center justify-around z-10 border-t-2 border-gray-300">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`
          }
        >
          <Home className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <ShoppingBag className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">
            Products
          </span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `group flex flex-col items-center relative ${
              isActive ? "text-green-500" : "text-gray-500"
            }`
          }
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-xs transition-colors duration-300">Cart</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`
          }
        >
          <Info className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">About</span>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-green-500" : "text-gray-500"
            }`
          }
        >
          <Phone className="w-6 h-6 group-hover:transform group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs transition-colors duration-300">
            Contact
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
