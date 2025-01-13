import React from "react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import pouring from "../assets/pouring.jpg"; // Make sure this path is correct

const Contact = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-6 py-16"
      style={{
        backgroundImage: `url(${pouring})`,
      }}
    >
      <div className="w-full max-w-4xl bg-white bg-opacity-80 rounded-lg shadow-lg p-8 transition-all transform ">
        <h2 className="text-3xl font-bold text-yellow-700 text-center mb-6 transition-transform transform ">
          Get in Touch with Us
        </h2>
        <p className="text-gray-600 text-center mb-8 transition-opacity opacity-80 hover:opacity-100">
          Have questions about our turmeric products? We're here to help! Fill
          out the form below, and we'll get back to you shortly.
        </p>

        {/* Contact Information Section */}
        <div className="contact-info-container mb-12 p-6 rounded-lg shadow-md transition-all transform ">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Contact Information
          </h3>

          {/* Store Contact Details */}
          <p className="text-gray-600 mt-4">
            <strong>Email:</strong> curcumin138@gamil.com
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +91 96989 04457
          </p>
          <p className="text-gray-600">
            <strong>Address:</strong> Perunduari, Erode, India
          </p>

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

          {/* General Inquiry */}
          <h4 className="text-md font-semibold text-green-600 mt-6">
            For General Inquiries
          </h4>
          <p className="text-gray-600">
            Please feel free to reach out to our customer service team. For
            specific department inquiries, refer to the department contacts
            below.
          </p>

          <div className="flex justify-center items-center gap-8 mt-2">
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
            className="w-full h-64 rounded-lg shadow-md transition-all transform "
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093877!2d144.9537363153229!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5773de2447c8b39!2sVictoria%20State%20Library!5e0!3m2!1sen!2sus!4v1613996775709!5m2!1sen!2sus"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
