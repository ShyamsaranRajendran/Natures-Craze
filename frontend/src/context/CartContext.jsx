import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error parsing cart data:', error);
      return [];
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item._id === product._id
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingItemIndex];
        
        // Update quantity for the selected pack size
        const updatedQuantities = {
          ...existingItem.quantities,
          [product.selectedPackSize]: (existingItem.quantities?.[product.selectedPackSize] || 0) + product.quantity
        };

        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantities: updatedQuantities
        };

        // toast.success(`${product.name} quantity updated!`);
        return updatedCart;
      } else {
        // Add new item
        const newItem = {
          ...product
        };
        toast.success(`${product.name} added to cart!`);
        return [...prevCart, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item._id !== productId);
      toast.success("Product removed from cart");
      return updatedCart;
    });
  }, []);

  const updateCartItem = useCallback((productId, packSize, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item._id === productId) {
          const currentQty = item.quantities?.[packSize] || 0;
          const newQty = Math.max(0, currentQty + change);

          const updatedQuantities = { ...item.quantities };
          
          if (newQty === 0) {
            delete updatedQuantities[packSize];
          } else {
            updatedQuantities[packSize] = newQty;
          }

          // Remove item if no quantities left
          if (Object.keys(updatedQuantities).length === 0) {
            return null;
          }

          return {
            ...item,
            quantities: updatedQuantities
          };
        }
        return item;
      }).filter(Boolean); // Remove null items
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart,
        updateCartItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};