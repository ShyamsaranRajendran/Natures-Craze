import React from "react";
import Logo from "../assets/logo.svg";

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50 hover:bg-opacity-10 transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-yellow-600">Turmeric World</h1>
        <div className="flex items-center space-x-4">
          <img
            src={Logo}
            alt="Logo"
            className="text-gray-500 bg-black w-5 h-5 cursor-pointer hover:text-yellow-600 transition-colors"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
