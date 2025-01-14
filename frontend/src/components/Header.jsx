import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

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
        <h1 className="text-xl font-bold text-yellow-600">Turmeric World</h1>
        <div className="flex items-center space-x-4">
          <img
            src={Logo}
            alt="Logo"
            className="w-5 h-5 cursor-pointer hover:text-yellow-600 transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
