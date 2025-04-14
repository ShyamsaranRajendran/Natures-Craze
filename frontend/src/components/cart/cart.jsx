import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ShoppingBag } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import api from "./api.js";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import CheckoutModal from "./CheckoutModal";
import { CartContext } from "../../context/CartContext.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productQuantities, setProductQuantities] = useState({});
  const [userDetails, setUserDetails] = useState({
    username: "",
    phoneNumber: "",
    address: "",
    alternatePhoneNumber: "",
  });
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [cartImg, setCartImg] = useState([]);
  
  const { 
    cart, 
    addToCart, 
    removeFromCart,
    updateCartItem,
    clearCart
  } = useContext(CartContext);

  // Load images on component mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        if (cart.length > 0) {
          await fetchImages(cart);
        }
      } catch (error) {
        console.error("Error loading images:", error);
        toast.error("Failed to load product images");
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize product quantities
    const initialQuantities = {};
    cart.forEach((item) => {
      initialQuantities[item._id] = {
        packSize: item.prices[0]?.packSize || "",
        quantity: 1,
      };
    });
    setProductQuantities(initialQuantities);

    loadImages();
  }, [cart]);

  // Fetch product images with retry logic
  const fetchImages = useCallback(async (cartItems, retryCount = 3) => {
    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const ids = cartItems.map((item) => item._id);
        const response = await api.post("/prod/images", { ids });

        const imageMap = response.data.images.reduce((acc, item) => {
          acc[item.id] = item.image;
          return acc;
        }, {});

        setCartImg(cartItems.map((item) => imageMap[item._id] || null));
        break;
      } catch (error) {
        if (attempt === retryCount - 1) {
          console.error("Error fetching images:", error);
          toast.error("Failed to load product images");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }, []);

  // Handle pack size change
  const handlePackSizeChange = useCallback((productId, packSize) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], packSize },
    }));
  }, []);

  // Handle adding a product to the cart
  const handleAddToCart = useCallback(
    (productId) => {
      const product = cart.find((item) => item._id === productId);
      
      // If no product found, show error
      if (!product) {
        toast.error("Product not found");
        return;
      }
  
      // Get or initialize product details
      const productDetails = productQuantities[productId] || {
        packSize: product.prices[0]?.packSize || "", // Default to first pack size
        quantity: 1 // Default quantity
      };
  
      // Validate pack size is selected
      if (!productDetails.packSize) {
        toast.warning("Please select a pack size");
        return;
      }
  
      // Validate price exists for selected pack size
      const priceObj = product.prices.find(p => p.packSize === productDetails.packSize);
      if (!priceObj) {
        toast.error("Price not found for selected pack size");
        return;
      }
  
      // Ensure quantity is valid number, default to 1
      const quantity = Number(productDetails.quantity) > 0 
        ? Number(productDetails.quantity) 
        : 1;
  
      // Add to cart with validated data
      addToCart({
        ...product,
        selectedPackSize: productDetails.packSize,
        quantity: quantity,
        price: priceObj.price // Include price for verification
      });
  
      // toast.success(`${product.name} (${productDetails.packSize}) added to cart`);
    },
    [cart, productQuantities, addToCart]
  );
  // Handle updating product quantity
  const handleUpdateQuantity = useCallback((productId, packSize, change) => {
    updateCartItem(productId, packSize, change);
  }, [updateCartItem]);

  // Calculate the total price of the cart
  const calculateTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Object.entries(item.quantities || {}).reduce((sum, [volume, qty]) => {
          const price = item.prices.find((p) => p.packSize === volume)?.price || 0;
          return sum + price * qty;
        }, 0)
      );
    }, 0);
  }, [cart]);

  // Handle checkout initiation
  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckoutModal(true);
  }, [cart.length]);

  // Load Razorpay script dynamically
  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  // Handle payment success
  const handlePaymentSuccess = useCallback(async (paymentResponse, razorpayOrderId, amount) => {
    try {
      const verificationResponse = await api.post("/orders/verify", {
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpaySignature: paymentResponse.razorpay_signature,
      });

      if (verificationResponse.status === 200) {
        toast.success("Payment successful!");
        setShowCheckoutModal(false);
        clearCart();

        navigate("/payment/paymentSuccess", {
          state: {
            message: "Payment verified successfully!",
            paymentDetails: paymentResponse,
            razorpayOrderId,
            orderDetails: amount,
          },
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/payment/paymentFailed", {
        state: {
          message: "Payment verification failed",
          error: error.message,
        },
      });
    } finally {
      setIsProcessing(false);
    }
  }, [navigate, clearCart]);

  // Handle confirming checkout and payment
  const handleConfirmCheckout = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Validate user details
      const { username, phoneNumber, alternatePhoneNumber, address } = userDetails;
      const phoneRegex = /^[0-9]{10}$/;

      if (!username || !phoneNumber || !address) {
        throw new Error("Please fill in all required fields");
      }

      if (!phoneRegex.test(phoneNumber)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      if (alternatePhoneNumber && !phoneRegex.test(alternatePhoneNumber)) {
        throw new Error("Please enter a valid alternate phone number");
      }

      // Ensure Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const orderItems = cart.map(({ _id, name, quantities, prices, description }) => ({
        _id,
        name,
        quantities,
        prices: prices.map(({ packSize, price }) => ({ packSize, price })),
        description: description || "No description available",
      }));

      // Validate order items
      if (orderItems.length === 0) {
        throw new Error("Your cart is empty. Please add items to proceed.");
      }

      // Send order data to backend
      const response = await api.post("/orders/create", {
        items: orderItems,
        username,
        phoneNumber,
        alternatePhoneNumber,
        address,
      });

      const { razorpayOrderId, amount } = response.data;

      if (!razorpayOrderId || !amount) {
        throw new Error("Failed to create order");
      }

      // Initialize Razorpay payment
      const options = {
        key: "rzp_live_vniaz7V3nXYe0J",
        amount,
        currency: "INR",
        name: "Natures Craze",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (paymentResponse) => {
          await handlePaymentSuccess(paymentResponse, razorpayOrderId, amount);
        },
        prefill: {
          name: username,
          contact: phoneNumber,
        },
        theme: { color: "#F37254" },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled");
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || "Checkout failed");
      setIsProcessing(false);
    }
  }, [cart, handlePaymentSuccess, isProcessing, loadRazorpayScript, userDetails]);

  // Handle input changes in the checkout form
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4 lg:px-8 mt-10">
      <ToastContainer position="top-right" theme="colored" />
      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 text-center px-4">Add some items to your cart to continue shopping</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 px-4">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
{cart.map((item, index) => (
  <CartItem
    key={`${item._id}-${index}`}
    item={item}
    cartImg={cartImg[index]}
    productQuantities={productQuantities}
    onPackSizeChange={handlePackSizeChange}
    onAddToCart={handleAddToCart}
    onUpdateQuantity={updateCartItem} // Changed from handleUpdateQuantity to updateCartItem
    onRemoveItem={removeFromCart}
  />
))}
            </div>
            <div className="lg:col-span-1">
<OrderSummary 
  total={calculateTotal()}
  onCheckout={handleCheckout} 
/>
            </div>
          </div>
        </div>
      )}
     <CheckoutModal
  showCheckoutModal={showCheckoutModal}
  setShowCheckoutModal={setShowCheckoutModal}
  userDetails={userDetails}
  handleInputChange={handleInputChange}
  handleConfirmCheckout={handleConfirmCheckout}
  isProcessing={isProcessing}
  calculateTotal={calculateTotal}
/>
    </div>
  );
};

export default Cart;