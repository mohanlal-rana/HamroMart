const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Add new shipping address (first time or update)
router.post("/add-shippingAddress", authenticateUser, shippingController.addShippingAddress);

// Update existing shipping address
router.put("/update-shippingAddress", authenticateUser, shippingController.updateShippingAddress);

// Get user's shipping address
router.get("/shippingAddress", authenticateUser, shippingController.getShippingAddress);

module.exports = router;
