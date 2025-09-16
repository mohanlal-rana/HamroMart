const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // one invoice per order
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String },

        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        landmark: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, required: true },
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    invoiceNumber: { type: String, required: true, unique: true }, // auto-generated
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
