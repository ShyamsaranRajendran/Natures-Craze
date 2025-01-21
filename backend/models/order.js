const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
    default: "pending", 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentStatus: { type: String, default: 'unpaid' }, // Can be 'pending', 'successful', or 'failed'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
