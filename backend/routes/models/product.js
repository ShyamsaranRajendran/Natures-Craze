const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    image: {
      type: Buffer,
    },
    stock: {
      type: Number,
      min: 0,
    },
    weight:{
      type: String,
      default: 'N/A'
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Update `updatedAt` field on document save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
