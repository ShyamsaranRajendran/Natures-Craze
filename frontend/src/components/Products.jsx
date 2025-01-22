import React, { useState, useEffect } from "react";
import { ShoppingCart, Phone, Share2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const regex = new RegExp(searchTerm, "i"); // Case-insensitive regex for matching
    return (
      regex.test(product.name) ||
      (product.weight && regex.test(product.weight.toString())) // Check weight as a string
    );
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  const handleAddToCart = (product) => {
    const { image, ...productWithoutImage } = product;

    const existingItem = cart.find(
      (item) =>
        item._id === productWithoutImage._id && item.volume === product.volume
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === productWithoutImage._id && item.volume === product.volume
          ? { ...item, quantity: item.quantity + 1 } // Increase the quantity of the existing item
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      toast.success(`${productWithoutImage.name} quantity increased!`);
    } else {
      const updatedCart = [...cart, { ...productWithoutImage, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      toast.success(`${productWithoutImage.name} added to cart!`);
    }
  };
const handleShare = (product) => {
  // Construct the WhatsApp URL with a pre-filled message (optional)
  const message = `Hello, I am interested in buying the product:${window.location.origin}/product/${product._id}.`;
  const phoneNumber = "+919361864257"; // Replace with the desired phone number

  // Open the WhatsApp chat URL
  window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-customYellow">
        <div
          className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
          aria-label="Loading..."
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-medium text-red-500 mt-10">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <ToastContainer />
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-lg font-medium text-gray-600">
          No products available.
        </p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Available Products
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <img
                    src={product.image || DefaultImage}
                    alt={product.name}
                    className="w-full h-48 lg:h-60 object-cover"
                  />
                </Link>
                <div className="p-4 flex flex-col space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                  <button
                    className="flex items-center text-blue-500"
                    onClick={() => handleShare(product)}
                  >
                    <Phone className="w-5 h-5 mr-1" /> WhatsApp
                  </button>
                  <button
                    className="flex items-center text-green-500"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
