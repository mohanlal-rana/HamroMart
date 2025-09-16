const express=require("express");
const router=express.Router();
const dashboardController=require("../controllers/dashboardController");
const {authenticateUser,authorizeAdmin}=require("../middleware/authMiddleware");

router.use(authenticateUser);
router.use(authorizeAdmin);

router.get("/stats",dashboardController.getDashboardStats);
router.get("/recent-orders",dashboardController.getRecentOrders);

module.exports=router;