const Invoice = require("../models/invoiceModel");
const Order = require("../models/orderModel");
const PDFDocument = require("pdfkit");

// Helper to generate invoice number
const generateInvoiceNumber = () => {
  const now = new Date();
  return `INV-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

// Generate Invoice
exports.generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId).populate("user", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.confirmed) {
      return res.status(400).json({ message: "Cannot generate invoice for unconfirmed order" });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({ order: order._id });
    if (existingInvoice) {
      return res.status(400).json({ message: "Invoice already generated for this order", invoice: existingInvoice });
    }

    // Create new invoice
    const invoice = new Invoice({
      order: order._id,
      customer: {
        name: order.shippingAddress.fullName,
        email: order.user?.email || "",
        phone: order.shippingAddress.phone || "",
        shippingAddress: order.shippingAddress,
      },
      orderItems: order.orderItems,
      itemsPrice: order.itemsPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt,
      invoiceNumber: generateInvoiceNumber(),
    });

    await invoice.save();

    res.status(201).json({ message: "Invoice generated successfully", invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Download Invoice as PDF
exports.downloadInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    // Invoice header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Customer Name: ${invoice.customer.name}`);
    doc.text(`Email: ${invoice.customer.email}`);
    const addr = invoice.customer.shippingAddress;
    doc.text(`Phone: ${addr.phone}`);

    doc.text(
      `Address: ${addr.addressLine1}${addr.addressLine2 ? ", " + addr.addressLine2 : ""}, ${addr.city}, ${addr.state}, ${addr.country}`
    );
    doc.moveDown();

    // Order items
    doc.text("Order Items:", { underline: true });
    invoice.orderItems.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.name} - ${item.quantity} x $${item.price} = $${(
          item.quantity * item.price
        ).toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.text(`Items Price: $${invoice.itemsPrice.toFixed(2)}`);
    doc.text(`Shipping Price: $${invoice.shippingPrice.toFixed(2)}`);
    doc.text(`Total Price: $${invoice.totalPrice.toFixed(2)}`);
    doc.text(`Payment Method: ${invoice.paymentMethod}`);
    doc.text(`Paid: ${invoice.isPaid ? "Yes" : "No"}`);
    if (invoice.isPaid) doc.text(`Paid At: ${invoice.paidAt}`);
    doc.text(`Delivered: ${invoice.isDelivered ? "Yes" : "No"}`);
    if (invoice.isDelivered) doc.text(`Delivered At: ${invoice.deliveredAt}`);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("order", "user totalPrice confirmed isPaid isDelivered");
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
