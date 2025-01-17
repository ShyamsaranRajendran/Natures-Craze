const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, // Customer's name
    phoneNumber: { type: String, required: true }, // Customer's contact number
    address: { type: String, required: true }, // Delivery address

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product reference
        name: { type: String, required: true }, // Product name
        price: { type: Number, required: true }, // Unit price of the product
        quantity: { type: Number, required: true }, // Quantity ordered
        totalPrice: { type: Number, required: true }, // price * quantity
      },
    ],

    totalAmount: { type: Number, required: true }, // Total order amount
    paymentDetails: {
      razorpayOrderId: { type: String }, // Razorpay order ID
      razorpayPaymentId: { type: String }, // Razorpay payment ID
      razorpaySignature: { type: String }, // Razorpay signature for payment verification
    },

    status: { type: String, default: "pending" }, // Order status: 'pending', 'completed', etc.
    createdAt: { type: Date, default: Date.now }, // Order creation timestamp
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
