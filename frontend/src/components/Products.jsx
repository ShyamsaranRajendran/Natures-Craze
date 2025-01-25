import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Phone,
  Search,
  Heart,
  Package,
  Camera,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Credits from "./Credits";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

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

    // Load favorites from localStorage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const filteredProducts = products.filter((product) => {
    const regex = new RegExp(searchTerm, "i");
    return (
      regex.test(product.name) ||
      (product.weight && regex.test(product.weight.toString()))
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
          ? { ...item, quantity: item.quantity + 1 }
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

                  window.location.reload();

  };

  const handleShare = (product) => {
    const message = `Hello, I am interested in buying the product:${window.location.origin}/product/${product._id}.`;
    const phoneNumber = "+919361864257";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));

    const action = favorites.includes(productId) ? "removed from" : "added to";
    toast.success(`Product ${action} favorites!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <p className="text-lg font-medium text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <ToastContainer position="top-right" theme="colored" />

      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-12 px-2 mt-10">
        <div className="max-w-7xl mx-auto mb-2 border rounded-lg p-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Turmeric Products
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our collection of high-quality turmeric products,
              carefully sourced and processed for maximum benefits.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name ..."
              className="w-full pl-10 pr-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 bg-white shadow-sm transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
              <Package className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative">
                      <div className="relative h-64 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-amber-50/10"></div>
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <button
                        onClick={() => toggleFavorite(product._id)}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.includes(product._id)
                              ? "text-red-500 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          (4.0)
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleShare(product)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contact
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Credits />
    </div>
  );
};

export default Products;
