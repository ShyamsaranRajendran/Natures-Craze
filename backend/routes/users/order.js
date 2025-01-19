const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../../models/order");
const Product = require("../../models/product"); // Assuming a Product model exists
const router = express.Router();
const crypto = require("crypto");

const razorpay = new Razorpay({
  // key_id: process.env.RAZORPAY_KEY_ID,
  key_id: "rzp_test_814EkXmD14BWDD",
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_secret: "tDGkmo8xCjbbEDG2kBSucvmB",
});


router.post("/verify", async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  console.log(req.body);
  console.log(razorpayPaymentId, razorpayOrderId, razorpaySignature);
  try {
    const generatedSignature = crypto
      .createHmac("sha256", "tDGkmo8xCjbbEDG2kBSucvmB") // Replace with your Razorpay Key Secret
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

     const updatedOrder = await Order.findOneAndUpdate(
      { "razorpayOrderId": razorpayOrderId },
      {
        $set: {
          "razorpayPaymentId": razorpayPaymentId,
          "razorpaySignature": razorpaySignature,
          "paymentStatus": "paid",
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});


router.post('/create', async (req, res) => {
  try {
    const { Items, username, phoneNumber, address } = req.body;

    // Validate required fields
    if (!username || !phoneNumber || !address) {
      return res.status(400).json({ message: 'Username, phone number, and address are required.' });
    }

    if (!Items || !Array.isArray(Items) || Items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array.' });
    }

    // Calculate total amount and process items
    let totalAmount = 0;
    const processedItems = Items.map((item) => {
      const { _id, name, quantities, prices: priceList, description } = item;

      if (!_id || !name || !quantities || !priceList) {
        throw new Error('Invalid cart item structure.');
      }

      const itemDetails = [];
      let itemTotal = 0;

      // Calculate item total and prepare individual items for the order
      Object.entries(quantities).forEach(([packSize, quantity]) => {
        const packPrice = priceList.find((price) => price.packSize === packSize)?.price || 0;
        const totalPrice = packPrice * quantity;

        itemDetails.push({
          productId: _id,
          name: name,
          weight: packSize,
          description: description || 'No description available',
          quantity,
          price: packPrice,
          totalPrice,
        });

        itemTotal += totalPrice;
      });

      totalAmount += itemTotal; // Add item total to the overall total

      return itemDetails;
    });

    // Flatten the processedItems array
    const flattenedItems = processedItems.flat();

    // Save the order in the database
    const order = new Order({
      username,
      phoneNumber,
      address,
      items: flattenedItems,
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

    // Save Razorpay order ID to the order document
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



// Endpoint to update order status (e.g., for processing, shipped, delivered)
router.get("/all", async (req, res) => {

  try {
    const order = await Order.find({});
    console.log(order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});



router.get('/processed', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'processed' });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


router.get('/processing', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'processing' });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});



router.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status value
  const validStatuses = ["pending", "processed", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error." });
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
