const express = require("express");
const router = express.Router();
const Product = require("../models/product.js");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


router.get('/all', async (req, res) => {
  try {
    console.log("Request Body:", req.body);


    const products = await Product.find(); // Adjust query if needed, such as filtering or sorting

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
   console.log('All Products:', products);
    // Respond with the list of products
    res.status(200).json({ products });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
