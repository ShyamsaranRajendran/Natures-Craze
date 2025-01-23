import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
const handleLoginClick = () => {
  navigate("/login");
};

const handleLogoutClick = () => {
  localStorage.removeItem("token");

  localStorage.removeItem("cart");
  window.location.reload();
};
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300  border-b-2 border-yellow-600 ${
        isScrolled
          ? "bg-white bg-opacity-50 backdrop-blur-md shadow-lg border-b-2 border-yellow-600"
          : "bg-white bg-opacity-30"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-yellow-600">NaturesCrazes</h1>
        <div className="flex items-center space-x-4">
          <img
            src={Logo}
            alt="Logo"
            onClick={handleLoginClick}
            onDoubleClick={handleLogoutClick}
            style={{ color: "black" }}
            className="w-5 h-5 cursor-pointer text-yellow-600 transition-colors "
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
