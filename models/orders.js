import mongoose from "mongoose";
import Joi from"joi";
let minimalProduct=mongoose.Schema({
    productName:String,
    Price:Number,
    imagePath:String,
    count:Number
})
let orderSchema=mongoose.Schema({
    orderDate:{type:Date,default: Date.now()},
    dueDate:{type:Date,default:function(){
        let currentDate=new Date();
        currentDate.setDate(currentDate.getDate()+7);
        return currentDate;
    }},
    orderAddress:String,
    cleintOrderCode:String,
    orderedProducts:[minimalProduct],
    orderOnTheWay:{type:Boolean,default:false}
})
export const orderModel=mongoose.model("orders",orderSchema);

export const validatorOrder=(_order)=>{
    const schema=Joi.object({
        orderAddress:Joi.string().min(2),
        orderedProducts:Joi.array().required(),
        dueDate:Joi.date().greater('now'),
        cleintOrderCode:Joi.string().min(2).required(),
    })
    return schema.validate(_order);
}

export const validatorMinimalProduct=async(_product)=>{
    const schema=Joi.object({
        productName:Joi.string().required(),
        price:Joi.number(),
        count:Joi.number().required(),
        imagePath:Joi.string()
    })
    
    return schema.validate(_product);
}