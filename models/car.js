import mongoose from "mongoose";
import Joi from "joi";
const carSchema = mongoose.Schema({
    productName: String,
    prodId: String,
    ownerId: String,
    price: Number,
    isElectronic: Boolean,
    prodYear: { type: Date, default: Date.now() },
    Picture: {
        type: String,
        validate: {
            validator: function (v) {
                // Add your image validation logic here
                // Example: Check if it's a valid URL or file path
                // You can also use external libraries for more advanced validation
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: 'Invalid image format',
        },
    },
    description:String
})
export const carModel = mongoose.model("cars", carSchema);


export const carValidator = (_car) => {
    const schema = Joi.object({
        productName: Joi.string().min(3).max(30).required(),
        prodYear: Joi.date().iso(),
        Picture: Joi.string().uri(),
        price: Joi.number(),
        isElectronic: Joi.boolean(),
        description: Joi.string().min(3).max(50).required()
    });
    return schema.validate(_car);
}