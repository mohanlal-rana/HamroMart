const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateUser, authorizeAdmin, authorizeVendor } = require("../middleware/authMiddleware");

router.use(authenticateUser);

// Create new order (COD)
router.post("/add", orderController.addOrder);

// Vendor orders MUST come before /:id to avoid CastError
router.get("/vendor", authorizeVendor, orderController.getVendorOrders);

// Admin routes
router.get("/", authorizeAdmin, orderController.getOrdersForAdmin);
router.put("/confirm-order", authorizeAdmin, orderController.confirmOrder);


// Single order by ID
router.get("/:id", orderController.getOrderById);

// Orders for a specific user
router.get("/user/:id", orderController.getUserOrder);

// Update order payment
router.put("/:id/pay", orderController.updatePayment);

// Mark order as delivered
router.put("/:id/deliver", orderController.makeOrderDelivered);

module.exports = router;
