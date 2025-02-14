import React, { useState, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaPhoneAlt, FaInstagram } from "react-icons/fa";

const SocialMediaLinks = () => {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulating loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col justify-center items-center py-16 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 animate-fadeIn">
        Follow Us
      </h2>

      <div className="flex justify-center items-center space-x-8">
        {loading ? (
          // Skeleton Loaders
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="w-12 h-12 bg-gray-300 animate-pulse rounded-full"
            ></div>
          ))
        ) : (
          // Actual Social Media Links
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default SocialMediaLinks;