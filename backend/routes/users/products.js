const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const JWT_SECRET = process.env.JWT_SECRET;


const storage = multer.memoryStorage(); // Store image in memory as a buffer
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit for images
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."), false);
    }
    cb(null, true);
  },
});

// Add Product Route
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, weight, description, price } = req.body;
    const image = req.file;

    // Validate required fields
    if (!name || !weight || !price || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      weight,
      description,
      price,
      image: image.buffer,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: "Failed to add product.", error: error.message });
  }
});

router.post("/images", async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No product IDs provided" });
    }

    // Find products by IDs
    const products = await Product.find({ _id: { $in: ids } });

    // If no products are found, return an error
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for the given IDs" });
    }

    // Convert the image buffer into a base64 string for each product
    const images = products.map(product => {
      const imageBuffer = product.image; // Assuming image is a Buffer
      const imageBase64 = imageBuffer.toString("base64"); // Convert the buffer to a base64 string
      return `data:image/jpeg;base64,${imageBase64}`; // Add the correct image MIME type
    });

    // Send the base64 encoded images as the response
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({ error: "Server error" });
  }
});

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

// Update Product Route
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weight, description, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.name = name || product.name;
    product.weight = weight || product.weight;
    product.description = description || product.description;
    product.price = price || product.price;

    if (req.file) {
      product.image = req.file.buffer; // Save the new image
    }

    await product.save();
    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update the product." });
  }
});

// Delete Product Route
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete the product." });
  }
});

// Get Product Count
router.get("/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ count: productCount });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Failed to fetch product count." });
  }
});

// Get Recent Products
router.get("/recent", async (req, res) => {
  try {
    const recentProducts = await Product.find()
      .sort({ updatedAt: -1 }) 
      .limit(5); 
    res.status(200).json({ products: recentProducts });
  } catch (error) {
    console.error("Error fetching recent products:", error);
    res.status(500).json({ message: "Failed to fetch recent products." });
  }
});

module.exports = router;
