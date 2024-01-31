import {addUser,getAllUsers,login} from "../controllers/user.js";
import express from "express";
import {userAuth,authAdmin} from "../middlewares/auth.js"

const router=express.Router();

router.get("/",authAdmin,getAllUsers);
router.post("/",addUser);
router.post("/login",login);

export default router;