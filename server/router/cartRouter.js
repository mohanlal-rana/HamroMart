const express=require("express")
const router=express.Router()
const cartController=require("../controllers/cartController")
const {authenticateUser}=require('../middleware/authMiddleware')

router.use(authenticateUser)
router.get("/",cartController.getCart)
router.post("/add/:productId",cartController.addCart)
router.put("/update/:productId",cartController.updateCart)
router.delete("/remove/:productId",cartController.removeCart)
router.delete("/clear",cartController.clearCart)


module.exports=router