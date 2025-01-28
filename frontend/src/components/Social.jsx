import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt, FaInstagram } from "react-icons/fa"; // Using react-icons

const SocialMediaLinks = () => {
  return (
    <div className="flex flex-col justify-center items-center py-16 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 animate-fadeIn">
        Follow Us
      </h2>

      <div className="flex justify-center items-center space-x-8">
        <Link
          to="/whatsapp"
          className="flex justify-center items-center bg-green-500 text-white shadow-lg rounded-full p-3 hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:bg-green-600"
        >
          <FaWhatsapp size={20} className="transition-colors duration-300" />
        </Link>

        <Link
          to="/call"
          className="flex justify-center items-center bg-blue-500 text-white shadow-lg rounded-full p-3 hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:bg-blue-600"
        >
          <FaPhoneAlt size={20} className="transition-colors duration-300" />
        </Link>

        <Link
          to="/instagram"
          className="flex justify-center items-center bg-pink-500 text-white shadow-lg rounded-full p-3 hover:scale-110 transition-all duration-300 ease-in-out transform hover:shadow-2xl hover:bg-pink-600"
        >
          <FaInstagram size={20} className="transition-colors duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default SocialMediaLinks;
