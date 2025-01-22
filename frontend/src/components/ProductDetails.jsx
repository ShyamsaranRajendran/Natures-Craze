import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultImage from "../assets/default-placeholder.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packSize, setPackSize] = useState("");
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (volume, change) => {
    const updatedTemporaryCart = temporaryCart.map((item) => {
      if (item._id === product._id) {
        const updatedQuantities = { ...item.quantities };
        const newQuantity = (updatedQuantities[volume] || 0) + change;

        if (newQuantity <= 0) {
          delete updatedQuantities[volume];
        } else {
          updatedQuantities[volume] = newQuantity;
        }

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
      <div className="flex items-center justify-center h-screen">
        <div className="loader" aria-label="Loading..."></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Product not found.</p>
      </div>
    );
  }

  const currentProductInTemporaryCart =
    temporaryCart.find((item) => item._id === product._id) || {};

  return (
    <div className="container mx-auto px-4 py-10">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
        <img
          src={product.image ? `${product.image}` : DefaultImage}
          alt={product.name}
          className="w-full max-w-xs mx-auto mb-6 rounded-lg object-cover"
        />
        <p className="text-gray-800 mb-4 text-sm md:text-base">
          {product.description}
        </p>

        <div className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <select
              value={packSize}
              onChange={(e) => setPackSize(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-auto"
            >
              <option value="" disabled>
                Select Pack Size
              </option>
              {product.prices.map((price) => (
                <option key={price._id} value={price.packSize}>
                  {price.packSize}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-24 text-center"
            />
            <button
              onClick={() => handleAddToTemporaryCart(product._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-6">
          {Object.entries(currentProductInTemporaryCart.quantities || {}).map(
            ([volume, qty]) => (
              <div
                key={volume}
                className="flex flex-row sm:flex-row items-center justify-between mb-4"
              >
                <p>
                  {volume} x {qty} = ₹
                  {product.prices.find((price) => price.packSize === volume)
                    ?.price * qty || 0}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(volume, 1)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleQuantityChange(volume, -1)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleAddToMainCart}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
          >
            Add to Cart
          </button>
          <button
            onClick={handleClearTemporaryCart}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full sm:w-auto"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
