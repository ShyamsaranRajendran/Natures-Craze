import React, { useEffect } from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaHeart,
  FaEnvelope, // Import the email icon
} from "react-icons/fa";

function Footer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".footer-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-yellow-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Section */}
        <div className="footer-section">
          <h3 className="text-lg font-bold mb-4">Natures Craze</h3>
          <p className="text-gray-200">
            We bring you premium, organic turmeric products to enhance your
            health and well-being. Discover the natural benefits of turmeric
            with our trusted range.
          </p>
        </div>

        {/* Legal Section */}
        <div className="footer-section">
          <h4 className="text-lg font-bold mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="/policy/terms"
                className="text-gray-200 hover:text-white"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/policy/privacy"
                className="text-gray-200 hover:text-white"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Section */}
        <div className="footer-section">
          <h4 className="text-lg font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="mailto:turmericcraze@gmail.com"
              className="text-gray-200 hover:text-white"
            >
              <FaEnvelope size={20} />
            </a>
            <a
              href="https://www.instagram.com/natures_craze_/"
              className="text-gray-200 hover:text-white"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/919361864257?text=Hello%20Turmeric%20Craze"
              className="text-gray-200 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-yellow-700 py-4 text-center">
        <p className="text-gray-200">
          © 2025 Nature Craze Pvt. All rights reserved.
        </p>
        <div className="mt-2">
          <a href="/policy/terms" className="text-gray-200 hover:text-white">
            Terms
          </a>
          <span className="mx-2">|</span>
          <a href="/policy/privacy" className="text-gray-200 hover:text-white">
            Privacy
          </a>
          <a
            href="/developer"
            className="text-gray-200 py-1 hover:text-white flex items-center justify-center"
          >
            Made with <FaHeart className="text-red-500 mx-1" /> by /codelancing_
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
