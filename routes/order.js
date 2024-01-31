import express from "express";
import {addOrder,deleteOrder,getAllOrders,getAllUsersByClientOrderCode,updateOrder} from "../controllers/orders.js";
import {authAdmin,userAuth} from "../middlewares/auth.js"

let router =express.Router();

router.get("/",authAdmin,getAllOrders);
router.get("/:id",userAuth,getAllUsersByClientOrderCode);
router.post("/",userAuth,addOrder);
router.delete("/:id",userAuth,deleteOrder);
router.put("/:id",authAdmin,updateOrder);

export default router;