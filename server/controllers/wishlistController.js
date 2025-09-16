const User = require("../models/userModel");
const Product = require("../models/productModel");

// Add product to wishlist
exports.addWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.status(200).json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove product from wishlist
exports.removeWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productId = req.params.productId;
    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
