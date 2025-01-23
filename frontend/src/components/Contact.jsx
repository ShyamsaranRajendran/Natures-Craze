import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[40vh]">
        <div className="absolute inset-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRKPPDhsG35ug0Lj7DG5UD2oVQZpVWQgiARg&s"
            alt="Turmeric Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            We're here to help with all your turmeric needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href="mailto:curcumin138@gmail.com"
                      className="text-gray-900 hover:text-amber-600"
                    >
                      curcumin138@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href="tel:+919361864257"
                      className="text-gray-900 hover:text-amber-600"
                    >
                      +91 93618 64257
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">
                      Kanagapuram, Erode,Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Hours</p>
                    <div className="text-gray-900">
                      <p>Mon - Fri: 9:00 AM - 9:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Connect With Us
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://wa.me/+919361864257"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FaWhatsapp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-green-700 font-medium">WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/natures_delightz_?igsh=MWx5MDVtZ2Y3NDZnMA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                    <FaInstagram className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-pink-700 font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Map and Policies */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="rounded-lg overflow-hidden shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d4906.632741494903!2d77.67110567504889!3d11.255685288923734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDE1JzIwLjUiTiA3N8KwNDAnMjUuMyJF!5e1!3m2!1sen!2sin!4v1737632699741!5m2!1sen!2sin"
                  className="w-full h-[400px]"
                  title="Location Map"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Our Policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Privacy Policy", path: "/policy/privacy" },
                  { title: "Terms & Conditions", path: "/policy/terms" },
                  { title: "Refund Policy", path: "/policy/refund" },
                  { title: "Shipping Policy", path: "/policy/shipping" },
                ].map((policy, index) => (
                  <Link
                    key={index}
                    to={policy.path}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors group"
                  >
                    <span className="text-gray-900 group-hover:text-amber-700">
                      {policy.title}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
