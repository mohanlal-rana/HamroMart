const mongoose = require("mongoose"); // ← use this in Node.js

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    features: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    confirmed: {
      type: Boolean,
      default: false, // Admin must confirm
    },
    confirmedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema); // no need for `new`
module.exports = Product;
