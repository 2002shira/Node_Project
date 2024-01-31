import mongoose from "mongoose";
import Joi from "joi";


let userSchema=mongoose.Schema({
    identity:String,
    email:String,
    userName:String,
    password:String,
    role:{type:String,default:'USER'},
    registerDate:{ type: Date, default: Date.now() }
});
export const userModel=mongoose.model("users",userSchema);



export const userValidatorForLogin = (_user) => {

    const schema = Joi.object({
        userName: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).required()
    });
    return schema.validate(_user);
}

export const userValidator = (_user) => {
    const schema = Joi.object({
        userName: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,15}$')).required(),
        identity:Joi.string().pattern(new RegExp(/^[0-9]{9}$/)).required(),
        email:Joi.string().email().required(),
        role: Joi.string().valid("USER","ADMIN").required()
       });

    return schema.validate(_user);
};

