const User = require("../models/userModel");

// @desc    Get logged-in user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Become a vendor (update profile with vendor details)
// @route   PUT /api/users/bevendor
// @access  Private
const beVendor = async (req, res) => {
  try {
    const { shopName, shopDescription, gstNumber } = req.body;

    if (!shopName || !gstNumber) {
      return res
        .status(400)
        .json({ message: "Shop name and GST number are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.vendor = {
      shopName,
      shopDescription,
      gstNumber,
      isVerified: false, // by default false until admin verifies
    };

    // user.role = "vendor"; // change role to vendor

    await user.save();

    res.json({
      message:
        "Vendor profile created successfully. Waiting for admin verification.",
      vendor: user.vendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete logged-in user account
// @route   DELETE /api/users/profile
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get specific user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Fetch the user first
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Prevent assigning vendor role if vendor info is missing
    if (role === "vendor") {
      if (
        !user.vendor ||
        !user.vendor.shopName ||
        !user.vendor.shopDescription
      ) {
        return res.status(400).json({
          message:
            "Cannot assign vendor role. Vendor shop information is incomplete.",
        });
      }
    }

    // Update role
    user.role = role;
    user.vendor.isVerified = true;
    await user.save();

    // Return updated user (without password)
    const updatedUser = await User.findById(req.params.id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete user by ID (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  beVendor,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
