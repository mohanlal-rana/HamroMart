const ShippingAddress = require("../models/shippingAddressModel");


// Add new shipping address
exports.addShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId)

    const { fullName, phone, addressLine1, city, postalCode } = req.body;
    if (!fullName || !phone || !addressLine1 || !city || !postalCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already has a shipping address
    const existing = await ShippingAddress.findOne({ user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Shipping address already exists. Use update." });
    }

    const newAddress = await ShippingAddress.create({
      user: userId,
      fullName,
      phone,
      addressLine1,
      addressLine2: req.body.addressLine2 || "",
      city,
      state: req.body.state || "",
      postalCode,
      country: req.body.country || "Nepal",
      landmark: req.body.landmark || "",
    });

    res
      .status(201)
      .json({ message: "Shipping address added", address: newAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update shipping address
exports.updateShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const updated = await ShippingAddress.findOneAndUpdate(
      { user: userId },
      {
        fullName: req.body.fullName,
        phone: req.body.phone,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        landmark: req.body.landmark,
      },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    res
      .status(200)
      .json({ message: "Shipping address updated", address: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get shipping address
exports.getShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await ShippingAddress.findOne({ user: userId });

    if (!address) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    res.status(200).json({ address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
