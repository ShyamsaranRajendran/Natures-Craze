import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Phone, Info, ShoppingBag, ShoppingCart, Menu, X, LogIn,LogOut } from "lucide-react";
import { CartContext } from "../context/CartContext"; // Import CartContext
import Credits from "./Credits";

const BottomNavigation = () => {
  const { cart } = useContext(CartContext); // Get cart from context
  const [isOpen, setIsOpen] = useState(false); // State for hamburger menu
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Convert token existence to boolean
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsAuthenticated(false);
    navigate("/login");
    window.location.reload();
  };
  return (
    <div>
      {/* Credits Component */}
      <Credits />

      {/* Desktop Navigation - Hamburger Menu */}
      <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 w-full z-50 border-b-2 border-gray-300 opacity-90">
        <h1 className="text-xl font-bold text-yellow-600">NaturesCraze</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          {isOpen ? <X className="w-8 h-8 text-gray-600" /> : <Menu className="w-8 h-8 text-gray-600" />}
        </button>
      </div>

      {/* Dropdown Menu for Desktop when open */}
      {isOpen && (
  <div className="fixed top-16 right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50 lg:block border border-gray-300">  <NavLink
            to="/"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Products
          </NavLink>
          <NavLink
  to="/cart"
  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-between items-center"
  onClick={() => setIsOpen(false)}
>
  <span>Cart</span>
  {cart.length > 0 && (
    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
      {cart.length}
    </span>
  )}
</NavLink>

          <NavLink
            to="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </NavLink>
          {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Log Out
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Log In
          </NavLink>
        )}
        </div>
      )}

      {/* Mobile Navigation - Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-xl py-4 flex items-center justify-around z-10 border-t-2 border-gray-300">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-orange-500" : "text-gray-500"
            }`
          }
        >
          <Home className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-red-500" : "text-gray-500"
            }`
          }
        >
          <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs">Products</span>
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
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-500"
            }`
          }
        >
          <Info className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs">About</span>
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `group flex flex-col items-center ${
              isActive ? "text-green-500" : "text-gray-500"
            }`
          }
        >
          <Phone className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
          <span className="text-xs">Contact</span>
        </NavLink>
        
      </div>
    </div>
  );
};

export default BottomNavigation;
