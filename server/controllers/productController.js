
const Product = require("../models/productModel");

// ----------------- PUBLIC -------------------

// Get all products (active and confirmed only)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, confirmed: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID (only if active and confirmed)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive || !product.confirmed) {
      return res.status(404).json({ message: "Product not found or not confirmed" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Public search products (by name, category, or description)
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query; // Get search query from ?q=keyword
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const products = await Product.find({
      isActive: true,
      confirmed: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).limit(20); // limit results for performance

    res.status(200).json(products);
  } catch (err) {
    console.error("Search Products Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get products by category (active and confirmed only, optional excludeId)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const excludeId = req.params.excludeId || null;

    const query = {
      category,
      isActive: true,
      confirmed: true,
    };
    if (excludeId) query._id = { $ne: excludeId };

    const products = await Product.find(query).limit(10);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- VENDOR -------------------

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const imageFiles = req.files
      ? Array.from(req.files).map(file => ({ url: `/uploads/${file.filename}`, alt: req.body.name }))
      : [];

// Handle features
let features = [];
if (req.body.features) {
  if (Array.isArray(req.body.features)) {
    features = req.body.features; // already an array
  } else if (typeof req.body.features === "string") {
    try {
      features = JSON.parse(req.body.features); // fallback for stringified JSON
    } catch (err) {
      return res.status(400).json({ message: "Invalid features format" });
    }
  }
}


    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock: parseInt(req.body.stock),
      discount: parseFloat(req.body.discount) || 0,
      images: imageFiles,
      features,
      vendor: req.user._id, // ✅ use _id directly
    });

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get vendor's products
exports.getVendorProducts = async (req, res) => {

  try {
    const vendorId = req.user._id; // ✅ use _id here
   

    const products = await Product.find({ vendor: vendorId });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update product

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, discount, stock, category } = req.body;
    
    // Multer handles these as arrays. No need for parsing.
    let features = Array.isArray(req.body.features) ? req.body.features : [];
    let deletedImages = Array.isArray(req.body.deletedImages) ? req.body.deletedImages : [];

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Coerce numbers safely
    price = price !== undefined ? Number(price) : product.price;
    discount = discount !== undefined ? Number(discount) : product.discount;
    stock = stock !== undefined ? Number(stock) : product.stock;
    
    // Update product fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price;
    product.discount = discount;
    product.stock = stock;
    product.category = category ?? product.category;
    product.features = features;

    // Remove deleted images
    if (deletedImages.length > 0) {
      product.images = product.images.filter(img => !deletedImages.includes(img.url));
    }

    // Append new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({
        url: `/uploads/${f.filename}`,
        alt: f.originalname
      }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role === "vendor" && product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can delete only your own products" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- ADMIN -------------------

// Admin confirms a product
exports.confirmProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.confirmed = true;
    product.confirmedAt = Date.now();

    await product.save();
    res.status(200).json({ message: "Product confirmed successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin fetch all products with vendor info
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name email");
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
