import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pouring from "../assets/pouring.jpg";
import Credits from "./Credits"
import {
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Leaf,
  Award,
  Shield,
  Sun,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-amber-50 to-white font-sans">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={Pouring}
            alt="Turmeric Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-400 mb-6 leading-tight">
            Pure & Natural
            <br />
            <span className="text-white">Turmeric Products</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
            Experience the authentic goodness of traditionally processed
            turmeric, crafted with care for your health and wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="px-8 py-4 bg-amber-500 text-white text-lg font-medium rounded-full hover:bg-amber-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-medium rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
            Why Choose Our Turmeric?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "100% Organic",
                description:
                  "Sourced from certified organic farms with sustainable practices",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Premium Quality",
                description:
                  "Cold-ground to preserve natural oils and nutrients",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Lab Tested",
                description: "Verified for purity and curcumin content",
              },
              {
                icon: <Sun className="w-8 h-8" />,
                title: "Traditional Process",
                description: "Following age-old methods for authentic results",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-amber-50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-500 text-white rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Categories */}
      <div className="py-20 px-4 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Our Premium Products
          </h2>

          {[
            {
              title: "Unboiled Turmeric Powder",
              description:
                "Pure, raw turmeric powder processed without heat for maximum potency",
              image:
                "data:image/jpeg;base64,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",
            },
            {
              title: "Organic Boiled Turmeric",
              description:
                "Traditionally processed turmeric with enhanced color and aroma",
              image:
                "https://images.jdmagicbox.com/quickquotes/images_main/cooking-organic-turmeric-powder-6-month-shelf-life-2223279917-slvelqvm.jpg",
            },
            {
              title: "Golden Milk Blend",
              description: "Premium turmeric blend with complementary spices",
              image:
                "https://media.post.rvohealth.io/wp-content/uploads/2020/09/6243-turmeric_jar-732x549-thumbnail-732x549.jpg",
            },
          ].map((category, index) => (
            <div key={index} className="mb-8">
              <div
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => toggleCategory(index)}
              >
                <div className="flex items-center p-6">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-20 h-20 rounded-lg object-cover mr-6"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{category.description}</p>
                  </div>
                  {activeCategory === index ? (
                    <ChevronUp className="w-6 h-6 text-amber-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div
                  className={`px-6 pb-6 ${
                    activeCategory === index ? "block" : "hidden"
                  }`}
                >
                  <div className="pt-4 border-t border-gray-100">
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        Premium quality, carefully sourced ingredients
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        Rich in natural curcumin and essential oils
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        Lab-tested for purity and potency
                      </li>
                    </ul>
                    {/* <Link
                      to={`/category/${index + 1}`}
                      className="mt-4 inline-flex items-center text-amber-600 hover:text-amber-700"
                    >
                      Learn more
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-amber-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Join thousands of satisfied customers who have made our turmeric
            products part of their daily wellness routine.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-600 text-lg font-medium rounded-full hover:bg-amber-50 transition-colors duration-300"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
      <Credits/>
    </div>
  );
};

export default HomePage;
