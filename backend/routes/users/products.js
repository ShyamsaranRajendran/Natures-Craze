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

    const { name,description, prices } = req.body;
    const image = req.file;

    // Validate required fields
    if (!name || !prices || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Parse prices if sent as a JSON string
    let parsedPrices;
    try {
      parsedPrices = JSON.parse(prices); // Parse the prices field if it's sent as JSON
    } catch (err) {
      return res.status(400).json({ message: "Invalid prices format. Ensure it's a valid JSON array." });
    }

    // Validate the parsed prices
    if (!Array.isArray(parsedPrices) || parsedPrices.length === 0) {
      return res.status(400).json({ message: "Prices must be a non-empty array." });
    }

    for (const priceObj of parsedPrices) {
      if (!priceObj.packSize || !priceObj.price) {
        return res.status(400).json({ message: "Each price must include 'packSize' and 'price' fields." });
      }
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      prices: parsedPrices,
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

    // Validate input: Check if IDs are provided and in the correct format
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No product IDs provided" });
    }

    // Find products by IDs in the database
    const products = await Product.find({ _id: { $in: ids } });

    // Handle case where no matching products are found
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for the given IDs" });
    }

    // Map images with their corresponding IDs
    const images = products.map((product) => {
      const imageBuffer = product.image; // Assuming `image` is a Buffer in the Product schema
      const imageBase64 = imageBuffer
        ? `data:image/jpeg;base64,${imageBuffer.toString("base64")}` // Convert buffer to base64
        : null; // If no image, return null or a default placeholder URL

      return {
        id: product._id, // Include the product ID
        image: imageBase64, // Include the base64-encoded image or null
      };
    });

    // Send the mapped images and IDs to the frontend
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
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, desc, prices } = req.body;
  const image = req.file;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = desc || product.description;

    if (image) {
      product.image = image.buffer
    }

    // Update prices array
    if (prices && Array.isArray(prices)) {
      product.prices = prices;
    }

    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
      product: product,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product' });
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


// Fetch product price list
router.get("/price-chart", async (req, res) => {
  try {
    // Query all products and return their name and prices
    const products = await Product.find({}, { name: 1, prices: 1, _id: 0 });

    res.status(200).json({
      success: true,
      message: "Product price list fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching product price list:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product price list",
      error: error.message,
    });
  }
});

module.exports = router;
