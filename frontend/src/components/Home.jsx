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

const HomePage = () => {
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

  // Shuffle images array
  const shuffleImages = () => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled.slice(0, 2)); // Show only 2 images
  };

  useEffect(() => {
    shuffleImages();
  }, []);

  const navigate = useNavigate(); // Get the navigate function

  // Function to handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`); // Navigate to the selected category page
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center animate-fadeIn"
        style={{ backgroundImage: `url(${image1})` }}
      >
        {/* Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center text-white">
          <h1 className="text-4xl font-extrabold text-yellow-500 animate-fadeInFromTop">
            Welcome to the World of Turmeric
          </h1>
          <p className="text-xl mt-4 max-w-2xl mx-auto animate-fadeInFromBottom">
            Discover the finest turmeric powders, plants, and more to enhance
            your health and cooking.
          </p>
          <Link
            to="/shop"
            className="mt-8 px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>

      <div className="mt-6 px-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Main Categories
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Category 1 */}
          <div
            className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCategoryClick("cat1")} // Use the handleCategoryClick function
          >
            <img
              src={image1}
              alt="Turmeric Powder 1"
              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <div className="absolute bottom-2 left-2">
              <p className="text-sm font-bold text-white">Golden Turmeric</p>
              <p className="text-xs text-gray-300">Premium quality</p>
            </div>
          </div>

          {/* Category 2 */}
          <div
            className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCategoryClick("cat2")} // Use the handleCategoryClick function
          >
            <img
              src={image2}
              alt="Turmeric Powder 2"
              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <div className="absolute bottom-2 left-2">
              <p className="text-sm font-bold text-white">Organic Turmeric</p>
              <p className="text-xs text-gray-300">100% natural</p>
            </div>
          </div>

          {/* Category 3 */}
          <div
            className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleCategoryClick("cat3")} // Use the handleCategoryClick function
          >
            <img
              src={image3}
              alt="Turmeric Powder 3"
              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <div className="absolute bottom-2 left-2">
              <p className="text-sm font-bold text-white">Pure Turmeric</p>
              <p className="text-xs text-gray-300">Best for cooking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Section */}
      <div className="mt-8 px-4">
        <div className="bg-orange-500 p-4 rounded-lg shadow-md text-white">
          <h2 className="text-lg font-bold ">
            Experience our delicious new products
          </h2>
          <p className="text-2xl font-bold animate-rapid-color-change">
            30% OFF
          </p>
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Recommend</h2>
        <div className="grid grid-cols-2 gap-4">
          {shuffledImages.map((image, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-20 object-cover"
              />
              <div className="p-2">
                <h3 className="text-sm font-bold text-gray-700">
                  {image.price}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
