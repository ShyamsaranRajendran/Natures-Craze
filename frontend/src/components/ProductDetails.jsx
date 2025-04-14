import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, ShoppingCart, Package, Minus, Plus, Trash2, ChevronLeft } from "lucide-react";
import { CartContext } from "../context/CartContext";
import DefaultImage from "../assets/default-placeholder.png";

const backendURL = process.env.REACT_APP_BACKEND_URL;
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackSize, setSelectedPackSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  
  // Use the cart context
  const { cart, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data.product);
        // Set the first pack size as default if available
        if (data.product?.prices?.length > 0) {
          setSelectedPackSize(data.product.prices[0].packSize);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedPackSize) {
      toast.warning("Please select a pack size");
      return;
    }

    if (quantity <= 0) {
      toast.warning("Please select a valid quantity");
      return;
    }

    // Find the price for the selected pack size
    const priceInfo = product.prices.find(p => p.packSize === selectedPackSize);
    if (!priceInfo) {
      toast.error("Invalid pack size selected");
      return;
    }

    // Prepare the product data for the cart
    const productToAdd = {
      ...product,
      quantities: { [selectedPackSize]: quantity },
      selectedPrice: priceInfo.price
    };

    // Use the context method to add to cart
    addToCart(productToAdd, selectedPackSize, quantity);
    
    toast.success(`${product.name} (${selectedPackSize}) added to cart!`);
    
    // Reset quantity after adding
    setQuantity(1);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  // ... (keep your loading and error states the same)

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-amber-50 to-white">
        <p className="text-lg text-gray-700">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" theme="colored" />
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-amber-600 hover:text-amber-800 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        <span>Back to Products</span>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
              <img
                src={product.image || DefaultImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = DefaultImage;
                }}
              />
              {product.rating && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" fill="currentColor" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Pack Size Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-amber-600" />
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.prices.map((price) => (
                    <button
                      key={price._id}
                      onClick={() => setSelectedPackSize(price.packSize)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedPackSize === price.packSize
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {price.packSize} - ₹{price.price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center space-x-4 max-w-xs">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-lg ${
                      quantity <= 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold text-gray-800 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - ₹
                {selectedPackSize && product.prices.find(p => p.packSize === selectedPackSize)?.price * quantity || 0}
              </button>

              {/* Product Highlights */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Product Highlights
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>100% Natural and Organic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>No Artificial Preservatives</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span>Premium Quality Ingredients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;