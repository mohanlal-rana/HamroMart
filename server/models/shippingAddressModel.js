const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ensures only one address per user
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Nepal",
    },
    landmark: {
      type: String, // optional field to help delivery
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema);
