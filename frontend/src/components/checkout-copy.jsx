import React, { useContext, useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, X, CreditCard, Truck, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const backendURL = process.env.REACT_APP_BACKEND_URL;

const CheckoutPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartItemCount,
    clearCart
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit-card'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Prepare order data that matches backend expectations
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        },
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        paymentMethod: formData.paymentMethod
      };
  
      console.log('Sending to backend:', orderData);
  
      // Create order in backend
      const response = await axios.post(`${backendURL}/payments/create`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      const { orderId, razorpayOrderId, amount } = response.data;
  
      // Initialize Razorpay payment
      const options = {
        key: "rzp_test_814EkXmD14BWDD"||process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function(response) {
          try {
            // Verify payment with backend
            const verification = await axios.post(`${backendURL}/payments/verify`, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderId
            });
  
            if (verification.data.success) {
              toast.success('Payment successful!');
              clearCart();
              navigate('/order-success', {
                state: {
                  orderId: orderId,
                  paymentId: response.razorpay_payment_id,
                  amount: amount / 100
                }
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
            navigate('/payment-failed');
          }
        },
        prefill: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          contact: orderData.customer.phone
        },
        theme: {
          color: '#F59E0B'
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city || 
        !formData.state || !formData.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Handle different payment methods
    if (formData.paymentMethod === 'cod') {
      try {
        setIsProcessing(true);
        // Create COD order on backend
        const orderData = {
          amount: cartTotal,
          paymentMethod: 'cod',
          products: cart,
          shippingDetails: formData
        };
        console.log('Order Data:', orderData);
        await axios.post(`${backendURL}/orders/create`, orderData);
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/order-success', {
          state: {
            paymentMethod: 'cod',
            amount: cartTotal,
            products: cart
          }
        });
      } catch (error) {
        console.error('Order creation error:', error);
        toast.error('Failed to place order');
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Handle online payment
      await handlePayment();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <ShoppingCart className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">There are no items in your cart to checkout</p>
          <Link
            to="/products"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <ToastContainer position="top-right" theme="colored" />
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="credit-card" className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" /> Credit/Debit Card
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor="cod" className="flex items-center">
                    <Truck className="w-5 h-5 mr-2" /> Cash on Delivery
                  </label>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Shield className="w-5 h-5 mr-2 text-amber-500" />
                <span>Your payment information is processed securely.</span>
              </div>

              <button
                type="submit"
                className={`w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-medium transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order (₹${cartTotal.toFixed(2)})`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between items-start border-b pb-4">
                  <div className="flex items-start">
                    <div className="mr-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.weight}</p>
                      <div className="flex items-center mt-1">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="text-gray-500 hover:text-amber-600"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="text-gray-500 hover:text-amber-600"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">Turmeric Benefits</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Natural anti-inflammatory properties</li>
                <li>• Powerful antioxidant benefits</li>
                <li>• Supports joint and digestive health</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;