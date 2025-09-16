const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, authorizeAdmin, authorizeVendor } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { vendorSchema } = require('../validators/formValidator');

// -------------------- CURRENT USER --------------------
// Fetch logged-in user info
// router.get("/me", authenticateUser, async (req, res) => {
//   res.json({ user: req.user });
// });
router.get("/me", authenticateUser, async (req, res) => {
  res.json({ user: req.user });
});

// Profile routes
router.get('/profile', authenticateUser, userController.getProfile);
router.put('/profile', authenticateUser, userController.updateProfile);
router.delete('/profile', authenticateUser, userController.deleteAccount);

// -------------------- VENDOR --------------------
// Request to become vendor
router.put('/be-vendor',validate(vendorSchema), authenticateUser, userController.beVendor);

// Example: vendor-only routes
// router.get('/vendor/orders', authenticateUser, authorizeVendor, vendorController.getOrders);

 
// -------------------- ADMIN ONLY --------------------
router.get('/', authenticateUser, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticateUser, authorizeAdmin, userController.getUserById);
router.put('/:id/role', authenticateUser, authorizeAdmin, userController.updateUserRole);
router.delete('/:id', authenticateUser, authorizeAdmin, userController.deleteUser);

module.exports = router;
