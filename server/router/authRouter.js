const express = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validateMiddleware');
const { signupSchema, loginSchema } = require('../validators/authValidator');
// const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/signup',validate(signupSchema),authController.signup);
router.post('/verify-otp',authController.verifyOTP);
router.post('/login',validate(loginSchema),authController.login);

// router.get("/me", authenticateUser, async (req, res) => {
//   // send latest user from DB
//   res.json({ user: req.user });
// });

module.exports = router;