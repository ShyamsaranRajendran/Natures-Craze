const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("Error: JWT_SECRET is not set in the environment variables");
  process.exit(1);
}

// Utility to format products (e.g., convert image buffer to base64)
const formatProduct = (product) => {
  return {
    ...product._doc,
    image: product.image ? `data:image/jpeg;base64,${product.image.toString("base64")}` : null,
  };
};

// Route to fetch all products
router.get("/all", async (req, res) => {
  try {
    console.log("Fetching all products...");

    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const formattedProducts = products.map(formatProduct);

    console.log(`Found ${formattedProducts.length} products`);
    res.status(200).json(formattedProducts);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Fetching product with ID: ${id}`);
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch recommended products
    const recommendedProducts = await Product.find({
      name: { $regex: product.name.split(" ")[0], $options: "i" },
      _id: { $ne: id },
    }).limit(5);

    const formattedProduct = formatProduct(product);
    const formattedRecommended = recommendedProducts.map(formatProduct);

    console.log(`Product found: ${formattedProduct.name}`);
    res.status(200).json({ product: formattedProduct, recommendedProducts: formattedRecommended });
  } catch (err) {
    console.error("Error fetching product:", err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
