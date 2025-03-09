import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, Package, Loader2, Menu, LogOut, X } from "lucide-react";

const BottomNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setShowLogoutConfirm(false)
    setMenuOpen(false);
    window.location.reload(); // Reload the page  
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* Desktop Navigation (Hamburger Menu) */}
      <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-white shadow-md fixed top-0 w-full z-50 border-b-2 border-gray-300">
        <h1 className="text-xl font-bold text-yellow-600">NaturesCraze</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="ml-auto focus:outline-none">
          {menuOpen ? <X className="w-8 h-8 text-gray-600" /> : <Menu className="w-8 h-8 text-gray-600" />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="hidden md:block fixed top-16 right-0 w-40 bg-white shadow-lg rounded-lg p-4 z-50">
          <nav className="flex flex-col space-y-3">
            <NavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center space-x-3 text-gray-700 hover:text-orange-500 transition">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/admin/products" onClick={() => setMenuOpen(false)} className="flex items-center space-x-3 text-gray-700 hover:text-red-500 transition">
              <ShoppingBag className="w-5 h-5" />
              <span>Products</span>
            </NavLink>
            <NavLink to="/admin/orders" onClick={() => setMenuOpen(false)} className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 transition">
              <Package className="w-5 h-5" />
              <span>Orders</span>
            </NavLink>
            {/* <NavLink to="/admin/failedOrders" onClick={() => setMenuOpen(false)} className="flex items-center space-x-3 text-gray-700 hover:text-purple-500 transition">
              <Loader2 className="w-5 h-5" />
              <span>Unpaid</span>
            </NavLink> */}
            <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center space-x-3 text-gray-700 hover:text-red-500 transition">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white shadow-xl py-4 flex items-center justify-around z-10 border-t-2 border-gray-300">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `group flex flex-col items-center ${isActive ? "text-orange-500" : "text-gray-500"}`} aria-label="Home">
          <Home className="w-6 h-6 group-hover:-translate-y-2 transition-all duration-300" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => `group flex flex-col items-center ${isActive ? "text-red-500" : "text-gray-500"}`} aria-label="Products">
          <ShoppingBag className="w-6 h-6 group-hover:-translate-y-2 transition-all duration-300" />
          <span className="text-xs">Products</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => `group flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-500"}`} aria-label="Orders">
          <Package className="w-6 h-6 group-hover:-translate-y-2 transition-all duration-300" />
          <span className="text-xs">Orders</span>
        </NavLink>

        {/* <NavLink to="/admin/failedOrders" className={({ isActive }) => `group flex flex-col items-center ${isActive ? "text-purple-500" : "text-gray-500"}`} aria-label="Unpaid">
          <Loader2 className="w-6 h-6 group-hover:-translate-y-2 transition-all duration-300" />
          <span className="text-xs">Unpaid</span>
        </NavLink> */}
      </div>
    </>
  );
};

export default BottomNavigation;
