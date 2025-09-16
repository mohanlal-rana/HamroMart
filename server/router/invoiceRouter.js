const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { authenticateUser, authorizeAdmin } = require("../middleware/authMiddleware");

router.use(authenticateUser);
router.get("/", authorizeAdmin, invoiceController.getAllInvoices);
router.post("/generate-invoice",authorizeAdmin,invoiceController.generateInvoice)
router.get("/download/:invoiceId", authorizeAdmin, invoiceController.downloadInvoice);

module.exports = router;
