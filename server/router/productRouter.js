const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const { productSchema, updateProductSchema } = require("../validators/formValidator");

const productController = require("../controllers/productController");
const {
  authenticateUser,
  authorizeVendor,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const{ validateImages} = require("../middleware/validateImages");



router.get(
  "/vendor",
  authenticateUser,
  authorizeVendor,
  productController.getVendorProducts
);

// Get all products (including unconfirmed/inactive)
router.get(
  "/admin",
  authenticateUser,
  authorizeAdmin,
  productController.getAllProductsAdmin
);

// ---------------- PUBLIC ROUTES ----------------
// Search products (public)
router.get("/search", productController.searchProducts);

// Get all active & confirmed products
router.get("/", productController.getAllProducts);

// Get product by ID (only if active & confirmed)
router.get("/:id", productController.getProductById);

// Get products by category (active & confirmed)
router.get("/category/:category", productController.getProductsByCategory);

// ---------------- VENDOR ROUTES ----------------

router.post(
  "/",
  authenticateUser,
  authorizeVendor,
  upload.array("images", 5),
  validateImages,
  validate(productSchema),
  productController.createProduct
);

// Update product (vendor can update only their own)
router.patch(
  "/:id",
  authenticateUser,
  authorizeVendor,
  upload.array("images", 5),
  // validateImages,
  validate(updateProductSchema),

  productController.updateProduct
);

// Delete product (vendor can delete only their own)
router.delete(
  "/:id",
  authenticateUser,
  authorizeVendor,
  productController.deleteProduct
);

// ---------------- ADMIN ROUTES ----------------

// Update any product
router.put(
  "/admin/:id",
  authenticateUser,
  authorizeAdmin,
  productController.updateProduct
);

// Confirm a product
router.put(
  "/admin/confirm-product/:id",
  authenticateUser,
  authorizeAdmin,
  productController.confirmProduct
);

// Delete any product
router.delete(
  "/admin/:id",
  authenticateUser,
  authorizeAdmin,
  productController.deleteProduct
);

module.exports = router;
