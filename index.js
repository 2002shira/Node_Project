import express from "express"
import {config} from "dotenv"
import cors from "cors"
import { connectToDB } from "./config/dbConfig.js";
import carRouter from "./routes/car.js"
import { errorHandling } from "./middlewares/errorHandlingMiddleware.js";
import userRouter from "./routes/user.js"
import orderRouter from "./routes/order.js"

config();
connectToDB();
const app=express();
app.use(cors({origin:"http://localhost:3500"}));
app.use(express.json());

app.use("/api/cars",carRouter);
app.use("/api/users",userRouter);
app.use("/api/orders",orderRouter);

app.use(errorHandling);
let port=3500;
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})