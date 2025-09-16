// controllers/dashboardController.js
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.getDashboardStats = async (req, res) => {
  try {
    // 🟢 Orders
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ confirmed: false });

    // 🟢 Products
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ confirmed: false });

    // 🟢 Users
    const users = await User.countDocuments();
    const pendingVendors = await User.countDocuments({
      role: "customer", // Only customers
     "vendor.gstNumber": { $exists: true,  $nin: ["", null] }, // Has submitted vendor form
      "vendor.isVerified": false, // Not verified yet
    });

    res.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      pendingProducts,
      users,
      pendingVendors,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching dashboard stats" });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(orders);
  } catch (err) {
    console.error("Recent orders error:", err);
    res
      .status(500)
      .json({ error: "Server error while fetching recent orders" });
  }
};
