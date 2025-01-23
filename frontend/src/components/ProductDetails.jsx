import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, ShoppingCart, Package, Minus, Plus, Trash2 } from "lucide-react";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packSize, setPackSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const getCartFromLocalStorage = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const [cart, setCart] = useState(() => getCartFromLocalStorage());
  const [temporaryCart, setTemporaryCart] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${backendURL}/prod/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAddToTemporaryCart = (productId) => {
    if (!packSize || quantity <= 0) {
      toast.warning("Please select a valid pack size and quantity.");
      return;
    }

    const existingProduct = temporaryCart.find(
      (item) => item._id === productId
    );

    if (existingProduct) {
      const updatedQuantities = {
        ...existingProduct.quantities,
        [packSize]: (existingProduct.quantities?.[packSize] || 0) + quantity,
      };

      const updatedTemporaryCart = temporaryCart.map((item) =>
        item._id === productId
          ? { ...item, quantities: updatedQuantities }
          : item
      );

      setTemporaryCart(updatedTemporaryCart);
    } else {
      const newProduct = {
        _id: productId,
        name: product.name,
        description: product.description,
        prices: product.prices,
        rating: product.rating,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        reviews: product.reviews,
        quantities: { [packSize]: quantity },
        quantity: 1,
      };

      setTemporaryCart([...temporaryCart, newProduct]);
    }

    toast.success(`${quantity} packs of ${packSize} added to temporary cart!`);
    setPackSize("");
    setQuantity(1);
    window.scrollTo({
      top: document.body.scrollHeight, // Scroll height of the document
      behavior: "smooth",
    });

  };

  const handleAddToMainCart = () => {
    const updatedCart = [...cart, ...temporaryCart];
    updateCart(updatedCart);
    setTemporaryCart([]);
    toast.success("Successfully added to the cart!");
  };

  const handleClearTemporaryCart = () => {
    setTemporaryCart([]);
    toast.info("Cart is cleared!");
  };

  const handleQuantityChange = (volume, qty) => {
    const updatedTemporaryCart = temporaryCart.map((item) => {
      if (item._id === product._id) {
        const updatedQuantities = { ...item.quantities };
        updatedQuantities[volume] = qty;
        return { ...item, quantities: updatedQuantities };
      }
      return item;
    });

    const filteredTemporaryCart = updatedTemporaryCart.filter(
      (item) => Object.keys(item.quantities).length > 0
    );

    setTemporaryCart(filteredTemporaryCart);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-amber-50 to-white">
        <p className="text-lg text-gray-700">Product not found.</p>
      </div>
    );
  }

  const currentProductInTemporaryCart =
    temporaryCart.find((item) => item._id === product._id) || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <ToastContainer position="top-right" theme="colored" />
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:text-gray-800 mr-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Product Image */}
            <div className="md:w-1/2 relative">
              <div className="absolute inset-0 from-amber-100/50 to-amber-50/30"></div>
              <img
                src={
                  product.image ||
                  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80"
                }
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium Quality
              </div>
            </div>

            {/* Right side - Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-grow">
                  {product.name}
                </h1>
                {/* <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                  <Star
                    className="w-4 h-4 text-amber-500 mr-1"
                    fill="currentColor"
                  />
                  <span className="text-amber-700 font-medium">
                    {product.rating || 4.5}
                  </span>
                </div> */}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Pack Size Selection */}
              <div className="bg-amber-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-amber-600" />
                  Select Package Size
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-amber-200 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 bg-white"
                  >
                    <option value="">Select Size</option>
                    {product.prices.map((price) => (
                      <option key={price._id} value={price.packSize}>
                        {price.packSize} - ₹{price.price}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold text-gray-800 w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToTemporaryCart(product._id)}
                  className="p-3 mt-4 bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add
                </button>
              </div>

              {/* Temporary Cart */}
              {temporaryCart.length > 0 && (
                <div className="bg-white border-2 border-amber-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Current Selection
                  </h3>

                  {Object.entries(
                    currentProductInTemporaryCart.quantities || {}
                  ).map(([volume, qty]) => (
                    <div
                      key={volume}
                      className="flex items-center justify-between py-3 border-b border-amber-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{volume}</p>
                        <p className="text-amber-600">
                          ₹
                          {product.prices.find(
                            (price) => price.packSize === volume
                          )?.price * qty}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">{qty}</div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-800">
                        Total
                      </span>
                      <span className="text-xl font-bold text-amber-600">
                        ₹
                        {temporaryCart.reduce(
                          (total, item) =>
                            total +
                            Object.entries(item.quantities).reduce(
                              (subTotal, [size, qty]) =>
                                subTotal +
                                qty *
                                  (item.prices.find(
                                    (price) => price.packSize === size
                                  )?.price || 0),
                              0
                            ),
                          0
                        )}
                      </span>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToMainCart}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </button>
                      <button
                        onClick={handleClearTemporaryCart}
                        className="px-4 py-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
