import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    window.location.reload();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Header - Visible only on Mobile (sm) screens */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b-2 border-yellow-600 sm:block md:hidden lg:hidden xl:hidden bg-white shadow-md ${
          isScrolled
            ? "bg-white opacity-90 backdrop-blur-md shadow-lg"
            : "bg-white opacity-60"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-yellow-600">NaturesCraze</h1>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <LogOut
                className="cursor-pointer text-gray-700 hover:text-red-600"
                onClick={handleLogoutClick}
              />
            ) : (
              <LogIn
                className="cursor-pointer text-gray-700 hover:text-green-600"
                onClick={() => navigate("/login")}
              />
            )}
          </div>
        </div>
      </header>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
