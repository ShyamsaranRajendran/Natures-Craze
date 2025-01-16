const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to the Product model
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        packSize: { type: String, required: true },
        totalPrice: { type: Number, required: true }, // Calculated as quantity * price
        weight: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true }, // Total price for the order
    razorpayOrderId: { type: String }, // Razorpay order ID
    razorpayPaymentId: { type: String }, // Razorpay payment ID
    razorpaySignature: { type: String }, // Razorpay signature for payment verification
    status: { type: String, default: "pending" }, // Order status (e.g., 'pending', 'completed')
    shippingDetails: {
      username: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the Order model using the order schema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
