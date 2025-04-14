import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Phone, Info, ShoppingBag, ShoppingCart, Menu, X, LogIn, LogOut } from "lucide-react";
import { CartContext } from "../context/CartContext";
import Credits from "./Credits";

const BottomNavigation = () => {
  const { cart } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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

      {/* Desktop Navigation - Full Navbar */}
      <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 w-full z-50 border-b-2 border-gray-300 opacity-90">
      <h1 className="text-xl font-bold text-yellow-600">
  <NavLink to="/">
    NaturesCraze
  </NavLink>
</h1>
        
        <div className="flex items-center space-x-12">
          <NavLink
            to="/"
            className={({ isActive }) => 
              `flex items-center space-x-1 ${isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-400"}`
            }
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/products"
            className={({ isActive }) => 
              `flex items-center space-x-1 ${isActive ? "text-red-500" : "text-gray-700 hover:text-red-400"}`
            }
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </NavLink>
          
          <NavLink
            to="/cart"
            className={({ isActive }) => 
              `flex items-center space-x-1 relative ${isActive ? "text-green-500" : "text-gray-700 hover:text-green-400"}`
            }
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                  {cart.length}
                </span>
              )}
            </div>
            <span>Cart</span>
          </NavLink>
          
          <NavLink
            to="/about"
            className={({ isActive }) => 
              `flex items-center space-x-1 ${isActive ? "text-blue-500" : "text-gray-700 hover:text-blue-400"}`
            }
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </NavLink>
          
          <NavLink
            to="/contact"
            className={({ isActive }) => 
              `flex items-center space-x-1 ${isActive ? "text-green-500" : "text-gray-700 hover:text-green-400"}`
            }
          >
            <Phone className="w-5 h-5" />
            <span>Contact</span>
          </NavLink>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => 
                `flex items-center space-x-1 ${isActive ? "text-purple-500" : "text-gray-700 hover:text-purple-400"}`
              }
            >
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 w-full z-50 border-b-2 border-gray-300 opacity-90">
        <h1 className="text-xl font-bold text-yellow-600">NaturesCraze</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-8 h-8 text-gray-600" /> : <Menu className="w-8 h-8 text-gray-600" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 right-0 w-full bg-white shadow-lg py-2 z-50 border-b border-gray-300">
          <NavLink
            to="/"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </NavLink>
          
          <NavLink
            to="/products"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </NavLink>
          
          <NavLink
            to="/cart"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 justify-between"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </div>
            {cart.length > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                {cart.length}
              </span>
            )}
          </NavLink>
          
          <NavLink
            to="/about"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </NavLink>
          
          <NavLink
            to="/contact"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Phone className="w-5 h-5" />
            <span>Contact</span>
          </NavLink>
          
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Log In</span>
            </NavLink>
          )}
        </div>
      )}

      {/* Mobile Navigation - Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-xl py-3 flex items-center justify-around z-10 border-t-2 border-gray-300">
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