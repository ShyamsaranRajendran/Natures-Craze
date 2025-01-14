const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer")
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

const storage = multer.memoryStorage(); // Store images as Buffer in memory
const upload = multer({ storage });

// Add Product Route
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, weight, description, price } = req.body;
    const imageBuffer = req.file.buffer;

    const newProduct = new Product({
      name,
      weight,
      description,
      price,
      image: imageBuffer,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product." });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.name = name || product.name;
    product.weight = weight || product.weight;

    if (req.files && req.files.image) {
      product.image = req.files.image.data; // Assuming you're using express-fileupload
    }

    await product.save();
    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update the product." });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid product ID format." });
    }

    res.status(500).json({ message: "Failed to delete the product." });
  }
});

module.exports = router;
