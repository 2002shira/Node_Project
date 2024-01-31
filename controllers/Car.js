import mongoose from "mongoose";
import { carModel, carValidator } from "../models/car.js";
export const getAllCars = async (req, res) => {
    // http://localhost:3500/api/cars?search=tesla

    let { search } = req.query;
    let perPage = req.query.perPage || 40;
    let page = req.query.page || 1;
    let ex1 = new RegExp(`${search}`); // The string must end with
    try {
        let filter = {};
        if (search) {
            filter.productName = ex1; 
        }
        let allCars = await carModel
            .find(filter)
            .skip((page - 1) * perPage) // Skip a certain number of documents
            .limit(perPage); // Limit the number of returned documents
        res.json(allCars);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const getAllCars_regular = async (req, res) => {
    try {
        let allCars = await carModel.find({}, "-price");
        res.json(allCars)
    }
    catch (error) {
        res.status(400).send("there was error retrieving the details" + error.message);
    }
}
export const getCarById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "id error", message: "id is not valid" })
        const car = await carModel.findById(id);
        if (!car)
            return res.status(404).json({ type: "id not found", message: "did not find car with such id" })
        return res.json(car);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message })
    }
}

export const addCar = async (req, res) => {
    let validate = carValidator(req.body);
    if (validate.error)
        return res.status(400).json({ type: "not valid", message: validate.error.details[0].message })
    let { productName, price, isElectronic, prodYear } = req.body
    try {
        let sameCar = await carModel.findOne({ $or: [{ productName: productName }, { price: price }] })
        if (sameCar)
            return res.status(409).json({ type: "same car", message: "this car with such parameters already exists." });
        let newCar = await carModel.create({ productName, price, isElectronic, prodYear });
        res.json(newCar);
    }
    catch (err) {
        res.status(400).json({ type: "error", message: `${err.message} you entered the catch` })
    }
}
export const deleteCarById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: "id error", message: "id is not valid" });
        const car = await carModel.findById(id);
        if (!car)
            return res.status(404).json({ type: "did not found id to delete", message: "did not find" });
        const deleted = await car.findByIdAndDelete(id);
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message })
    }
}

export const updateCar = async (req, res) => {
    try {
        let id = req.params.id;
        if (!mongoose.isValidObjectId(id))
            return res.status(404).send("the id is not a valid format");
        // Validate request body using Joi
        let validate = carValidator(req.body);
        if (validate.error)
            return res.status(400).json({ type: "not valid", message: validate.error.details[0].message });
        let carToUpdate = await carModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!carToUpdate)
            return res.status(404).send("we didn't find a car with such id to update");
        return res.status(200).json(carToUpdate);
    } catch (err) {
        res.status(400).json(err);
    }
};