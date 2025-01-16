const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../models/order");
const Product = require("../models/Product"); // Assuming a Product model exists
const router = express.Router();

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY",
  key_secret: "YOUR_RAZORPAY_SECRET",
});

// Endpoint to create an order
router.post("/create", async (req, res) => {
  const { userId, cartItems, username, phoneNumber, address } = req.body;

  try {
    // Fetch product details to calculate the total amount securely
    const productIds = cartItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    cartItems.forEach(item => {
      const product = products.find(prod => prod._id.toString() === item.productId);
      if (product) {
        totalAmount += item.quantity * product.price;
      }
    });

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to smallest currency unit (e.g., paise)
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    const order = new Order({
      userId,
      cartItems,
      razorpayOrderId: razorpayOrder.id,
      username,
      phoneNumber,
      address,
      totalAmount,
      status: "created", // Initial order state
    });

    await order.save();

    res.status(200).json({
      message: "Order created successfully",
      razorpayOrderId: razorpayOrder.id,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Endpoint to verify payment and update order status
router.post("/verify-payment", async (req, res) => {
  const { razorpayOrderId, paymentId, signature } = req.body;

  try {
    // Validate payment signature
    const isValid = razorpay.validatePaymentSignature({
      order_id: razorpayOrderId,
      payment_id: paymentId,
      signature,
    });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update order status to "paid"
    const updatedOrder = await Order.findOneAndUpdate(
      { razorpayOrderId },
      {
        paymentId,
        signature,
        status: "paid",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Payment verified and order updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
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
