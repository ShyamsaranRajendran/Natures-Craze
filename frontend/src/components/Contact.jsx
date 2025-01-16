import React from "react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import pouring from "../assets/pouring.jpg"; // Ensure the path to the image is correct
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming React Router is being used

const Contact = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 py-16"
      style={{
        backgroundImage: `url(${pouring})`,
      }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-80 rounded-lg shadow-lg p-8 transition-all transform">
        <h2 className="text-3xl font-bold text-yellow-700 text-center mb-6 transition-transform transform">
          Get in Touch with Us
        </h2>
        <p className="text-gray-600 text-center mb-8 transition-opacity opacity-80 hover:opacity-100">
          Have questions about our turmeric products? We're here to help! Fill
          out the form below, and we'll get back to you shortly.
        </p>

        {/* Contact Information Section */}
        <div className="contact-info-container mb-12 p-6 rounded-lg shadow-md transition-all transform">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Contact Information
          </h3>

          <div className="text-gray-600 mt-4 space-y-2">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />{" "}
              curcumin138@gamil.com
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-500" /> +91 96989 04457
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" /> Perunduari,
              Erode, India
            </div>
          </div>

          {/* Store Hours */}
          <h4 className="text-md font-semibold text-blue-600 mt-6">
            Store Hours
          </h4>
          <p className="text-gray-600">
            <strong>Monday - Friday:</strong> 9:00 AM - 9:00 PM
          </p>
          <p className="text-gray-600">
            <strong>Saturday:</strong> 10:00 AM - 6:00 PM
          </p>
          <p className="text-gray-600">
            <strong>Sunday:</strong> Closed
          </p>

          {/* Social Media Links */}
          <div className="flex justify-center items-center gap-8 mt-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/9698904457"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-3xl transition"
            >
              <FaWhatsapp />
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/natures_delightz_?igsh=MWx5MDVtZ2Y3NDZnMA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 text-3xl transition"
            >
              <FaInstagram />
            </a>
            {/* Email */}
            <a
              href="mailto:curcumin138@gamil.com"
              className="text-yellow-600 hover:text-yellow-700 text-3xl transition"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-container mt-8">
          <iframe
            title="Location Map"
            className="w-full h-64 rounded-lg shadow-md transition-all transform"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.9962934950386!2d77.71160931531163!3d11.341036091900853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96f517dba65b3%3A0x2d539b5fae46f40a!2sErode%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1613996775709!5m2!1sen!2sin"
            loading="lazy"
          ></iframe>
        </div>

        {/* Policies Section */}
        <div className="policies-section mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Policies</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>
              <Link
                to="/policy/privacy"
                className="text-blue-500 hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/policy/terms"
                className="text-blue-500 hover:underline"
              >
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/policy/refund"
                className="text-blue-500 hover:underline"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to="/policy/shipping"
                className="text-blue-500 hover:underline"
              >
                Shipping Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
