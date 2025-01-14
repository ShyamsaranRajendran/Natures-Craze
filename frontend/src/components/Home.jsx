import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../assets/turmeric_1.jpg";
import image2 from "../assets/turmeric_2.webp";
import image3 from "../assets/turmeric_3.jpg";
import image4 from "../assets/turmeric_4.webp";
import plant1 from "../assets/tur_plant.jpg";
import plant2 from "../assets/plant-2.jpg";
import plant3 from "../assets/plant-3.jpg";
import plant4 from "../assets/plant-4.jpg";
import Grinding from "../assets/grinding.jpg";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleCategory = (index) => {
    if (activeCategory === index) {
      setActiveCategory(null); // Close if the same category is clicked again
    } else {
      setActiveCategory(index); // Open the clicked category
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      setIsLoggedIn(false);
    }
    else {
      setIsLoggedIn(true);
    }
  }, []);

  const images = [
    { src: image1, alt: "Image 1", price: "$6.00" },
    { src: image2, alt: "Image 2", price: "$7.00" },
    { src: image3, alt: "Image 3", price: "$8.00" },
    { src: image4, alt: "Image 4", price: "$9.00" },
    { src: plant1, alt: "Plant 1", price: "$10.00" },
    { src: plant2, alt: "Plant 2", price: "$11.00" },
    { src: plant3, alt: "Plant 3", price: "$12.00" },
    { src: plant4, alt: "Plant 4", price: "$13.00" },
  ];

  const [shuffledImages, setShuffledImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const shuffleImages = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled.slice(0, 2)); // Show only 2 images
  };

  useEffect(() => {
    shuffleImages();
  }, []);

  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-roboto">
      {/* Hero Section */}
      <div
        className="relative h-[110vh] md:h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-poppins font-extrabold text-yellow-500">
            Welcome to the World of Turmeric
          </h1>
          <p className="text-lg md:text-2xl mt-4 max-w-2xl">
            Discover the finest turmeric powders, plants, and more to enhance
            your health and cooking.
          </p>
          <div className="flex flex-row items-center space-x-4">
            {/* Shop Now Button */}
            <Link
              to="/products"
              className="mt-6 md:mt-8 px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-all"
            >
              Shop Now
            </Link>

            {/* Login/Logout Button */}
            {!isLoggedIn ? (
              <button
                onClick={handleLoginClick}
                className="mt-6 md:mt-8 px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogoutClick}
                className="mt-6 md:mt-8 px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Categories */}
      <div className="mt-6 px-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center font-poppins">
          Main Categories
        </h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
            {images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative group bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => handleCategoryClick(`cat${index + 1}`)}
              >
                {/* Image Section */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8 bg-gray-50 p-6 md:p-12">
        <h2 className="text-xl md:text-4xl font-poppins font-bold text-gray-800 text-center mb-6">
          Experience the Purity of Cold Grinding
        </h2>
        <div className="flex flex-col items-center justify-center gap-6">
          <img
            src={Grinding}
            alt="Cold Grinding Process"
            className="rounded-lg shadow-lg w-80 h-64 object-cover"
          />

          <ul className="space-y-4 text-center">
            {[
              "Locks in nutrients, flavors, and aromas.",
              "Preserves the true essence of every ingredient.",
              "Keeps the natural goodness intact.",
              "Rich in flavor, aroma, and health benefits.",
              "Ensures unaltered freshness and maximum nutrition.",
            ].map((feature, index) => (
              <li
                key={index}
                className="text-gray-600 text-base md:text-3xl font-light"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Categories */}
      <div className="mt-10 px-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center font-poppins">
          Main Categories
        </h3>

        {/* Unboiled Turmeric Powder */}
        <div className="space-y-6">
          <div className="category-item">
            <h4
              className="text-lg font-semibold text-gray-800 hover:text-yellow-600 cursor-pointer flex items-center justify-between"
              onClick={() => toggleCategory(0)}
            >
              Unboiled Turmeric Powder
              <span className="text-lg transition-transform duration-300 transform">
                {activeCategory === 0 ? "▲" : "▼"}
              </span>
            </h4>
            <div
              className={`content transition-all ease-in-out duration-300 px-4 py-2 text-gray-700 ${
                activeCategory === 0 ? "block" : "hidden"
              }`}
            >
              <p>
                Our unboiled turmeric powder is made from high-quality,
                organically grown turmeric roots. Unlike traditional turmeric
                powders, this variety is processed without boiling, ensuring the
                retention of its natural oils, aroma, and vibrant color. It
                offers a raw, earthy flavor that enhances your dishes and
                provides a unique twist to traditional recipes.
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Health Benefits:</strong> Packed with curcumin, a
                  powerful antioxidant, our unboiled turmeric powder is known
                  for its anti-inflammatory and immunity-boosting properties.
                </li>
                <li>
                  <strong>Why Choose Us?</strong> 100% Organic, freshly ground,
                  and hygienically packed.
                </li>
                <li>
                  <strong>Usage:</strong> Add to curries, soups, and marinades,
                  blend with milk for a health drink, or use in DIY skincare
                  remedies.
                </li>
              </ul>
            </div>
          </div>

          {/* Organic Boiled Turmeric Powder */}
          <div className="category-item">
            <h4
              className="text-lg font-semibold text-gray-800 hover:text-yellow-600 cursor-pointer flex items-center justify-between"
              onClick={() => toggleCategory(1)}
            >
              Organic Boiled Turmeric Powder
              <span className="text-lg transition-transform duration-300 transform">
                {activeCategory === 1 ? "▲" : "▼"}
              </span>
            </h4>
            <div
              className={`content transition-all ease-in-out duration-300 px-4 py-2 text-gray-700 ${
                activeCategory === 1 ? "block" : "hidden"
              }`}
            >
              <p>
                Our organic boiled turmeric powder is crafted from carefully
                selected, high-quality turmeric roots that are boiled, dried,
                and ground to perfection. This traditional process enhances its
                rich color, earthy aroma, and strong flavor, making it a staple
                for cooking and wellness.
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Health Benefits:</strong> Rich in curcumin for
                  anti-inflammatory, antioxidant, and immunity-boosting
                  properties.
                </li>
                <li>
                  <strong>Why Choose Us?</strong> Certified Organic, enhanced
                  potency, hygienically processed.
                </li>
                <li>
                  <strong>Usage:</strong> Add a golden touch to curries, soups,
                  rice dishes, or use in wellness routines.
                </li>
              </ul>
            </div>
          </div>

          {/* Golden Milk Powder */}
          <div className="category-item">
            <h4
              className="text-lg font-semibold text-gray-800 hover:text-yellow-600 cursor-pointer flex items-center justify-between"
              onClick={() => toggleCategory(2)}
            >
              Golden Milk Powder (Made with Unboiled Turmeric Powder)
              <span className="text-lg transition-transform duration-300 transform">
                {activeCategory === 2 ? "▲" : "▼"}
              </span>
            </h4>
            <div
              className={`content transition-all ease-in-out duration-300 px-4 py-2 text-gray-700 ${
                activeCategory === 2 ? "block" : "hidden"
              }`}
            >
              <p>
                Our Golden Milk Powder is a premium blend crafted with unboiled
                turmeric powder, preserving its raw, natural goodness for
                maximum health benefits. This nourishing mix combines turmeric
                with spices like cinnamon, black pepper, and ginger to create a
                soothing and health-enhancing drink.
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Health Benefits:</strong> Immunity booster,
                  anti-inflammatory, detoxifier, and sleep support.
                </li>
                <li>
                  <strong>Why Choose Us?</strong> 100% Natural, no additives,
                  easy to use with milk or dairy-free alternatives.
                </li>
                <li>
                  <strong>Usage:</strong> Mix 1 tsp with warm milk, sweeten with
                  honey or jaggery, and enjoy for better health.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 px-4">
        <h2 className="text-lg md:text-2xl font-poppins font-bold text-gray-800">
          Choose the Best for Your Health
        </h2>
        <p className="text-gray-600 mt-4">
          Our turmeric powder, crafted with the cold grinding process, delivers
          unparalleled quality and nutrition.
        </p>
        <button
          className="mt-4 bg-yellow-800 text-white px-6 py-3 rounded-xl shadow-md hover:bg-yellow-600 transition"
          onClick={() => navigate("/products")}
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;
