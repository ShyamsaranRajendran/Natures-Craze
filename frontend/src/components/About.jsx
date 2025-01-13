import React from "react";
import image1 from "../assets/turmeric_3.jpg"; // Import the image
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white relative"
      style={{
        backgroundImage: `url(${image1})`, // Set the background image
      }}
    >
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black opacity-50 filter blur-xl"></div>

      {/* Container for the about page */}
      <div className="max-w-screen-lg mx-auto px-4 py-20 relative z-10">
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-4 animate__animated animate__fadeIn animate__delay-1s">
            About Us
          </h1>
          <p className="text-lg text-gray-200 opacity-80 animate__animated animate__fadeIn animate__delay-2s">
            We are passionate about delivering the finest turmeric powder to
            your doorstep, enriched with nature's goodness.
          </p>
        </div>

        {/* Story Section */}
        <div className="text-center mb-16 animate__animated animate__fadeIn animate__delay-3s">
          <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg text-gray-200 opacity-80">
            Our journey started with a simple idea: to bring you the purest and
            highest-quality turmeric powder, harvested from the finest farms. We
            work with trusted farmers who practice sustainable farming methods,
            ensuring that every grain of turmeric is packed with the natural
            benefits nature has to offer.
          </p>
        </div>

        {/* Product Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Health Benefit 1 */}
          <div className="bg-white bg-opacity-60 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className=" p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Boosts Immunity
              </h3>
              <p className="text-gray-600 text-sm mt-4">
                Our turmeric powder is known for its immune-boosting properties,
                keeping you healthy and vibrant all year round.
              </p>
            </div>
          </div>

          {/* Health Benefit 2 */}
          <div className="bg-white bg-opacity-60 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className=" p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Anti-Inflammatory
              </h3>
              <p className="text-gray-600 text-sm mt-4">
                Our turmeric powder has powerful anti-inflammatory effects,
                promoting joint health and reducing pain.
              </p>
            </div>
          </div>

          {/* Health Benefit 3 */}
          <div className="bg-white bg-opacity-60 rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className=" p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Rich in Antioxidants
              </h3>
              <p className="text-gray-600 text-sm mt-4">
                Packed with antioxidants, our turmeric powder helps combat free
                radicals and supports healthy skin.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="text-center animate__animated animate__fadeIn animate__delay-4s">
          <h2 className="text-3xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-200 opacity-80 mb-8">
            We are committed to delivering the highest quality turmeric powder.
            From farm to your table, we ensure that every batch is 100% natural,
            with no additives, ensuring maximum flavor and health benefits.
          </p>
          <p className="text-lg text-gray-200 opacity-80">
            We believe in sustainability and fair trade. Our farmers are paid
            fairly, and we use eco-friendly packaging to reduce our carbon
            footprint.
          </p>
        </div>

        {/* Contact Call-to-Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-teal-100 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-200 opacity-80">
            Have any questions or want to know more about our turmeric products?
            Feel free to reach out to us.
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default About;
