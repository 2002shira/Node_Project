import mongoose from "mongoose";
import { orderModel, validatorMinimalProduct, validatorOrder } from "../models/orders.js"
import { carModel } from "../models/car.js"

export const getAllOrders = async (req, res) => {
    try {
        let allOrders = await orderModel.find({});
        res.json(allOrders);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const deleteOrder = async (req, res) => {
    let { id } = req.params;
    let { _id } = req.user;
    // מה זה אומר הנקודה יוזר לאיזה יוזר הכוונה
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "invalide id", message: "id is invalide" });
    try {
        let order = await orderModel.findById(id)
        if (!order)
            return res.status(404)
                .json({ type: 'not found', message: 'not found order to delete with such id' });
        if (_id != clientOrderCode && req.user.role != "ADMIN")
            return res.status(403)
                .json({ type: 'Not match', message: 'You are not allowed to delete an order that it isnt yours' });
        if (order.orderOnTheWay)
            return res.status(400)
                .json({ type: 'order dispatched', message: 'The order has been dispatched,could not be deleted. sorry:(' });
        let deletedOrder = await orderModel.findByIdAndDelete(id);
        res.json(deletedOrder);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const addOrder = async (req, res) => {
    let{_id}=req.user;
    //console.log("the _id"+ _id);
    let validate = validatorOrder(req.body);
    if (validate.error)
        return res.status(400).json({ type: 'not valid body', message: validate.error.details[0].message });
    for (const item of req.body.orderedProducts) {
        let validateProducts = await validatorMinimalProduct(item);
        if (validateProducts.error)
            return res.status(400).json({ type: 'not valid body', message: validateProducts.error.details[0].message });
        let productName = item.productName;//מה אמור להיות עם המוצרים אני הרי עשיתי רכבים. אז אני אמור הלקורא לזה בתור רכב
        let productToAdd = await carModel.findOne({ productName });
        if (!productToAdd)
            return res.status(404).json({ type: 'not found', message: 'there is no product with such name' });
    }
    let { dueDate, orderAddress, orderOnTheWay, orderedProducts } = req.body;
    try {
        let clientOrderCode = req.user._id;
        let newOrder =  await orderModel.create({ dueDate, orderAddress, orderOnTheWay, orderedProducts, clientOrderCode })// מה זה אומר create פייגי עשתה כאן עם
        res.json(newOrder);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const getAllUsersByClientOrderCode = async (req, res) => {
    let { _id, role } = req.user;
    if (role == 'ADMIN' && req.body.clientOrderCode)
        _id = req.body.clientOrderCode;
    try {
        let allOrderByClientOrderCode = await orderModel.find({ clientOrderCode: _id });
        res.json(allOrderByClientOrderCode);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const updateOrder = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ type: "invalide id", message: "id is invalide" });
    try {
        let order = await orderModel.findById(id)
        if (!order)
            return res.status(404)
                .json({ type: 'not found', message: 'not found order to delete with such id' });
        await orderModel.findByIdAndUpdate(id, { orderOnTheWay: true });
        let orderToUpdate = await orderModel.findById(id);
        res.json("order in on the way:=> "+orderToUpdate.orderOnTheWay);
    }catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}