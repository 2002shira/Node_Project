import { addCar,deleteCarById,getAllCars,getCarById,updateCar,getAllCars_regular } from "../controllers/Car.js";
import express from "express";
import {userAuth} from "../middlewares/auth.js"
const router=express.Router();

router.get("/",userAuth,getAllCars);
// router.get("/",getAllCars_regular);
router.get("/:id",getCarById);
router.post("/",addCar);
router.put("/:id",updateCar);
router.delete("/:id",deleteCarById);

export default router;