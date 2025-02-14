import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Leaf,
  Heart,
  Truck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Shield,
  Sun,
} from "lucide-react";
const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img
            src="https://m.media-amazon.com/images/I/71OzxY5WpxS._AC_UF1000,1000_QL80_.jpg"
            alt="Turmeric Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-4">
            Our Story
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Bringing the finest turmeric from farm to table since 2016
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At the heart of our mission lies a commitment to delivering the
                purest, most potent turmeric products while preserving
                traditional farming and processing methods. We believe in the
                power of nature's remedies and work tirelessly to bring these
                benefits to your doorstep.
              </p>
              <div className="space-y-4">
                {[
                  "Supporting local farmers and sustainable agriculture",
                  "Maintaining the highest quality standards",
                  "Preserving traditional processing methods",
                  "Promoting health and wellness through natural products",
                ].map((point, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
              <img
                src="https://www.agrifarming.in/wp-content/uploads/The-Golden-Root-2.jpg"
                alt="Turmeric Farming"
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />

              <img
                src="https://gardenerspath.com/wp-content/uploads/2021/05/How-to-Grow-Turmeric-Cover.jpg"
                alt="Processing"
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-amber-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Sustainability",
                description:
                  "We practice eco-friendly farming and processing methods to protect our environment for future generations.",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Quality",
                description:
                  "Every batch of our turmeric is tested for purity and potency to ensure the highest quality standards.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community",
                description:
                  "We support local farmers and their families through fair trade practices and sustainable partnerships.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Cultivation",
                description: "Organic farming practices in fertile soil",
              },
              {
                icon: <Sun className="w-6 h-6" />,
                title: "Harvesting",
                description: "Hand-picked at peak maturity",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Processing",
                description: "Traditional cold grinding method",
              },
              {
                icon: <Truck className="w-6 h-6" />,
                title: "Delivery",
                description: "Carefully packed and delivered fresh",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
