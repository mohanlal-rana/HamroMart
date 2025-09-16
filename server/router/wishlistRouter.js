const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middleware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");

router.post("/add/:productId", authenticateUser, wishlistController.addWishlist);
router.delete("/remove/:productId",authenticateUser , wishlistController.removeWishlist);
router.get("/", authenticateUser, wishlistController.getWishlist);

module.exports = router;
