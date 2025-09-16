const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Get user cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to cart
exports.addCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, quantity: 1 });
      }
      await cart.save();
    }

    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action } = req.body; // "increment" or "decrement"
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "increment") item.quantity += 1;
    if (action === "decrement" && item.quantity > 1) item.quantity -= 1;

    await cart.save();
    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Remove product from cart
exports.removeCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    await cart.populate("items.product");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
