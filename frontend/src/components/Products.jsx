import React, { useState, useLayoutEffect, useRef, useMemo, useContext } from "react";
import { ShoppingCart, Phone, Search, Heart, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import DefaultImage from "../assets/default-placeholder.png";
import Credits from "./Credits";
import "react-toastify/dist/ReactToastify.css";
import ProductsLoader from "./ProductsLoader";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const containerRef = useRef(null);

  const { addToCart } = useContext(CartContext);

  useLayoutEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/all`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  const filteredProducts = useMemo(() => {
    const regex = new RegExp(searchTerm, "i");
    return products.filter((product) => regex.test(product.name));
  }, [searchTerm, products]);

  const toggleFavorite = (productId) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    toast.success(`Product ${favorites.includes(productId) ? "removed from" : "added to"} favorites!`);
  };

  if (loading) {
    return (
      <ProductsLoader />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 px-2" ref={containerRef}>
      <ToastContainer position="top-right" theme="colored" />

      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Premium Turmeric Products</h1>
        </div>

        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Package className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <p className="text-gray-600">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/product/${product._id}`}>
                  <div className="relative">
                    <img
                      src={product.image || DefaultImage}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product._id);
                      }}
                      className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(product._id) ? "text-red-500" : "text-gray-400"}`} />
                    </button>
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <button className="text-amber-600 hover:text-amber-700">
                      <Phone className="w-5 h-5 inline-block" /> Contact
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg"
                    >
                      <ShoppingCart className="w-5 h-5 inline-block" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
          </div>
        )}
      </div>
     
    </div>
  );
};

export default Products;