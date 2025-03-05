const express = require("express");
const Razorpay = require("razorpay");
const Order = require("../../models/order");
const PaidOrder = require("../../models/paidOrders");
const UnPaidOrder = require("../../models/unpaidOrders");
const Product = require("../../models/product"); // Assuming a Product model exists
const router = express.Router();
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_live_vniaz7V3nXYe0J",
  key_secret: "lNbjKV8iTX89QnGBIjEFE323",
  // key_id: "rzp_test_814EkXmD14BWDD",
  // key_secret: "tDGkmo8xCjbbEDG2kBSucvmB",
});


router.post("/verify", async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  
  try {
    // Step 1: Find the existing order or create a new one
    let order = await Order.findOne({ razorpayOrderId });

    if (!order) {
      order = new Order({
        razorpayOrderId,
        razorpayPaymentId: null,
        razorpaySignature: null,
        paymentStatus: "unpaid",
        createdAt: new Date(),
      });
      await order.save();
    }

    // Step 2: Generate signature and validate payment
    const generatedSignature = crypto
      .createHmac("sha256", "lNbjKV8iTX89QnGBIjEFE323")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      // Step 3A: Update order as failed and move to UnPaidOrder collection
      order.paymentStatus = "failed";
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      await order.save();

      const unpaidOrder = new UnPaidOrder({
        ...order.toObject(),
        reason: "Invalid payment signature",
        movedAt: new Date(),
      });

      await unpaidOrder.save();

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Step 3B: Update order as paid and move to PaidOrder collection
    order.paymentStatus = "successful";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    await order.save();

    const paidOrder = new PaidOrder({
      ...order.toObject(),
      verifiedAt: new Date(),
    });

    await paidOrder.save();

    res.status(200).json({ message: "Payment verified successfully" });

  } catch (error) {
    console.error("Payment verification error:", error);

    // Step 4: Store in UnPaidOrder in case of an unexpected error
    const unpaidOrder = new UnPaidOrder({
      razorpayOrderId,
      paymentStatus: "failed",
      reason: error.message,
      createdAt: new Date(),
    });

    await unpaidOrder.save();

    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});


router.post('/create', async (req, res) => {
  try {
    const { items, username, phoneNumber,alternatePhoneNumber, address } = req.body;
    const Items = items;
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
      alternatePhoneNumber,
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


    // Save Razorpay order ID to the order document
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    // Prepare the payload for Razorpay Checkout
    const checkoutPayload = {
      key: 'rzp_live_vniaz7V3nXYe0J',
      // key: 'rzp_test_814EkXmD14BWDD',  
      amount: totalAmount * 100, // Amount in smallest currency sub-unit (paise)
      currency: 'INR', // Currency code
      name: 'Natures Craze', // Business name
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
      callback_url: '', // Redirect URL on payment success
      redirect: false, // Redirect to callback URL after payment
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


router.patch("/assign-ids", async (req, res) => {
  try {
    // Fetch all orders sorted by creation date
    const orders = await Order.find().sort({ createdAt: 1 });

    // Ensure orders is an array
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found to update." });
    }

    let idCounter = 1; // Start the ID counter

    for (const order of orders) {
  order.order_id = idCounter++; // Assign the sequential ID

  // Ensure paymentStatus is valid
  if (!["pending", "successful", "failed"].includes(order.paymentStatus)) {
    order.paymentStatus = "pending"; // Set a default valid value
  }

  await order.save(); // Save the updated order
}


    res.status(200).json({
      message: "IDs assigned successfully to all orders.",
      totalUpdated: idCounter - 1, // Total number of orders updated
    });
  } catch (error) {
    console.error("Error assigning IDs:", error);
    res.status(500).json({ message: "Error assigning IDs", error });
  }
});

router.get("/charts", async (req, res) => {
    try {
        // Fetch all orders and only return the createdAt field
        const orders = await PaidOrder.find({}, 'createdAt'); // You can also use projection to select specific fields

        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

router.get("/id/:razorpay_order_id", async (req, res) => {
  try {
    const { razorpay_order_id } = req.params;
    const order = await PaidOrder.findOne({ razorpayOrderId : razorpay_order_id });
  
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const orders = await PaidOrder.find().sort({ createdAt: -1 }); // Descending order
   
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

router.get("/processed", async (req, res) => {
  try {
    const orders = await PaidOrder.find({ status: "processed" }).sort({ createdAt: -1 }); // Descending order
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/processing", async (req, res) => {
  try {
    const orders = await PaidOrder.find({ status: "processing" }).sort({ createdAt: -1 }); // Descending order
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/failed", async (req, res) => {
  try {
    const orders = await Order.find({paymentStatus:"unpaid"}).sort({ createdAt: -1 }); // Descending order
 
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the order
    const deletedOrder = await UnPaidOrder.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order", error });
  }
});

router.get("/order-status-count", async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status", // Group by order status
          count: { $sum: 1 } // Count orders for each status
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the response
          status: "$_id", // Rename the status field
          count: 1
        }
      }
    ]);

    // Create a default response for missing statuses if there are no orders for them
    const allStatuses = ["pending", "processed", "shipped", "delivered", "cancelled"];
    const result = allStatuses.map(status => {
      const statusCount = statusCounts.find(item => item.status === status);
      return {
        status,
        count: statusCount ? statusCount.count : 0
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching order status counts:", error);
    res.status(500).json({ error: "Failed to fetch order status counts" });
  }
});




router.patch("/edit/:id", async (req, res) => {
  const { id } = req.params; // Get the order ID from the request URL
  const { status } = req.body; // Get the new status from the request body


  // Validate the status value
  const validStatuses = ["pending", "processed", "processing", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    // Update the order status in the database
    const updatedOrder = await PaidOrder.findByIdAndUpdate(
      id,
      { status }, // Set the new status
      { new: true } // Return the updated order
    );

    // If no order is found, send a 404 error
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Send the updated order back in the response
    res.status(200).json(updatedOrder);
  } catch (error) {
    // Log the error and send a 500 error response
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



module.exports = router;
