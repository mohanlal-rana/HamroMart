const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// -------------------- CREATE NEW ORDER (COD) --------------------
exports.addOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Attach vendor and correct product info to each order item
    const itemsWithVendor = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        return {
          ...item,
          name: product.name,
          price: product.price,
          vendor: product.vendor,
        };
      })
    );

    const order = new Order({
      user: req.user._id,
      orderItems: itemsWithVendor,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Add order error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// -------------------- GET ORDER BY ID --------------------
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price vendor");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Access control: admin, vendor, or owner
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== order.user._id.toString() &&
      !order.orderItems.some(
        (item) => item.vendor.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- GET USER ORDERS --------------------
exports.getUserOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate("orderItems.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Confirm an order (admin only)
// @route   PUT /api/orders/confirm-order
// @access  Admin

exports.confirmOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // 1. Find the order by ID and populate the products
    const order = await Order.findById(orderId).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.confirmed) {
      return res.status(400).json({ message: "Order is already confirmed" });
    }

    // 2. Iterate through each product in the order and decrease stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product._id} not found` });
      }

      // Check if there is enough stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}. Available: ${product.stock}, Ordered: ${item.quantity}`,
        });
      }

      // Decrease the stock and save the product
      product.stock -= item.quantity;
      await product.save();
    }

    // 3. Confirm the order and save
    order.confirmed = true;
    order.confirmedAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE ORDER PAYMENT STATUS --------------------
exports.updatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- UPDATE ORDER DELIVERY STATUS --------------------
exports.makeOrderDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error delivering order:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- GET VENDOR ORDERS --------------------
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // Fetch all orders that have products from this vendor
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name price vendor") // populate product & vendor
      .sort({ createdAt: -1 });

    // Filter only the order items that belong to this vendor
    const vendorOrders = orders
      .map((order) => {
        const vendorItems = order.orderItems.filter(
          (item) => item.product?.vendor?.toString() === vendorId.toString()
        );
        if (vendorItems.length === 0) return null; // skip orders without this vendor's products
        return { ...order._doc, orderItems: vendorItems };
      })
      .filter(Boolean); // remove nulls

    res.json(vendorOrders);
  } catch (error) {
    console.error("Vendor orders error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- GET ALL ORDERS (ADMIN) --------------------
exports.getOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
