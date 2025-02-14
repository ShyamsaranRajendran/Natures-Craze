import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlide"; // ✅ Corrected import
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart Items:", cartItems); // Debugging cart state
  }, [cartItems]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  return (
    <div className="container mx-auto py-20">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems?.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <h3 className="text-lg">{item.name}</h3>
                <p>Price: ₹{item.price || 0}</p> {/* ✅ Ensure price is displayed */}
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500">
                Remove
              </button>
            </div>
          ))}

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Total Items: {totalQuantity}</h3>
            <h3 className="text-lg font-semibold">Total Price: ₹{totalPrice.toFixed(2)}</h3>
            <div className="flex gap-4 mt-2">
              <button onClick={() => navigate("/checkout")} className="bg-blue-500 text-white p-2 rounded">
                Proceed to Checkout
              </button>
              <button onClick={() => dispatch(clearCart())} className="bg-red-500 text-white p-2 rounded">
                Clear Cart
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
