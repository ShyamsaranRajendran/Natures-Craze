const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true, // Ensure the id field is unique
    },
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
    prices: [
      {
        packSize: { type: String, required: true }, // e.g., "250g", "500g"
        price: { type: Number, required: true, min: 0 }, // Price for that pack size
      },
    ],
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-increment the `id` field
productSchema.plugin(AutoIncrement, { inc_field: "id" });

// Update `updatedAt` field on document save
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
