import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const prices = {
    "250g": 200,
    "500g": 400,
    "750g": 600,
    "1000g": 1000,
  };

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save updated cart to localStorage
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId); // Remove the specific item
    updateCart(updatedCart);
    toast.success("Item removed from cart!");
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const handleAddItemAgain = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      // If the item already exists in the cart, increase the quantity
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      updateCart(updatedCart);
    } else {
      // Otherwise, add the item to the cart with quantity 1
      const updatedCart = [
        ...cart,
        { ...item, quantity: 1, volume: item.volume || "250g" },
      ]; // Default volume is 250g if not provided
      updateCart(updatedCart);
    }
    toast.success("Item added to cart!");
  };

  const handleClearCart = () => {
    updateCart([]);
    toast.success("Cart cleared!");
  };

  const handleCheckout = () => {
    // Placeholder logic for checkout process
    if (cart.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    // Typically, here you would integrate payment gateway logic
    toast.success("Proceeding to checkout...");
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + prices[item.volume || 200 ] * item.quantity,
      0
    );
  };

  const handleVolumeChange = (productId, newVolume) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, volume: newVolume } : item
    );
    updateCart(updatedCart);
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-base text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6 max-h-[80vh] overflow-y-auto">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-sm font-bold text-gray-700">
                  ₹ {prices[item.volume]} x {item.quantity}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <label className="text-sm text-gray-600">Volume:</label>
                  <select
                    value={item.volume}
                    onChange={(e) =>
                      handleVolumeChange(item._id, e.target.value)
                    }
                    className="px-3 py-1 text-sm border rounded-lg"
                  >
                    <option value="250g">250g</option>
                    <option value="500g">500g</option>
                    <option value="750g">750g</option>
                    <option value="1000g">1000g</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleIncreaseQuantity(item._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => handleDecreaseQuantity(item._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  -
                </button>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-col justify-between space-y-5 items-center mt-6">
            <h3 className="text-xl font-semibold">
              Total: ₹ {calculateTotal().toFixed(2)}
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={handleClearCart}
                className="px-4 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-lg"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
