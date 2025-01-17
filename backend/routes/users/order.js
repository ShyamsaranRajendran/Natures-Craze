const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../../models/order");
const Product = require("../../models/product"); // Assuming a Product model exists
const router = express.Router();

const razorpay = new Razorpay({
  // key_id: process.env.RAZORPAY_KEY_ID,
  key_id: "rzp_test_814EkXmD14BWDD",
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_secret: "tDGkmo8xCjbbEDG2kBSucvmB",
});

router.post('/create', async (req, res) => {
  try {
    const { Items, username, phoneNumber, address } = req.body;

    if (!Items || !Array.isArray(Items) || Items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array.' });
    }

    const prices = {
      '250g': 200,
      '500g': 400,
      '750g': 600,
      '1000g': 1000,
    };

    // Calculate total amount
    let totalAmount = Items.reduce((total, item) => {
      const itemTotal = Object.entries(item.quantities || {}).reduce(
        (subtotal, [weight, quantity]) => {
          const pricePerWeight = prices[weight] || 0; // Default to 0 if weight is not in prices
          return subtotal + pricePerWeight * quantity;
        },
        0
      );
      return total + itemTotal;
    }, 0);

    // Process items
    const processedItems = Items.map((item) => {
      if (!item._id || !item.name || !item.quantity || !item.quantities) {
        throw new Error('Invalid cart item structure.');
      }

      const itemTotal = Object.entries(item.quantities).reduce(
        (subtotal, [weight, quantity]) => {
          const pricePerWeight = prices[weight] || 0;
          return subtotal + pricePerWeight * quantity;
        },
        0
      );

      return {
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight || 'N/A',
        description: item.description || 'No description available',
        totalPrice: itemTotal,
      };
    });

    // Save the order in the database
    const order = new Order({
      username,
      phoneNumber,
      address,
      items: processedItems,
      totalAmount,
    });

    const savedOrder = await order.save();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: `receipt_${savedOrder._id}`,
      payment_capture: 1, // Enable auto capture of payment
    });

    console.log('Razorpay Order ID:', razorpayOrder.id);

    // Save the Razorpay order ID to the order document
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    // Prepare the payload for Razorpay Checkout
    const checkoutPayload = {
      key: 'rzp_test_814EkXmD14BWDD', // Your Razorpay Key ID
      amount: totalAmount * 100, // Amount in smallest currency sub-unit (paise)
      currency: 'INR', // Currency code
      name: 'My Business', // Business name
      description: 'Order Payment', // Description shown at checkout
      image: 'https://turmeric-tau.vercel.app/static/media/logo.07e4fd23b7d4a6e60e95cab57f39536f.svg', // Business logo URL (optional)
      order_id: razorpayOrder.id, // Razorpay order ID
      prefill: {
        name: username, // Customer's name
        email: '', // Customer's email (optional)
        contact: phoneNumber, // Customer's phone number
      },
      theme: {
        color: '#F37254',
      },
      callback_url: 'http://localhost:5000/success', // Redirect URL on payment success
      redirect: true, // Redirect to callback URL after payment
    };

    // Return the Razorpay order ID and checkout payload to frontend
    res.status(200).json({
      message: 'Order created successfully',
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount * 100,
      checkoutPayload: checkoutPayload,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});



// Endpoint to verify payment and update order status
router.post("/verify", async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  try {
    const isValid = razorpay.utils.verifyPaymentSignature({
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update order status in your database
    await Order.findOneAndUpdate(
      { razorpayOrderId },
      { status: "paid" }
    );

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});


// Endpoint to get orders for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Endpoint to update order status (e.g., for processing, shipped, delivered)
router.patch("/:orderId", async (req, res) => {
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});

module.exports = router;
