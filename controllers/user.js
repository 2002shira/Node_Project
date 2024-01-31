import { compare, hash } from "bcrypt";
import { userModel, userValidator, userValidatorForLogin } from "../models/user.js"
import { generateToken } from "../config/generateToken.js";

export const addUser = async (req, res) => {
    let validate = userValidator(req.body);
    if (validate.error)
        return res.status(400).json({ type: "not valid body", messafe: validate.error.details[0].message });
    let { userName, password, identity, email,role } = req.body;
    try {
        let sameUser = await userModel.findOne({ $or: [{ userName: userName }, { identity: identity }] });
        if (sameUser)
            return res.status(409).json({ type: "same user", message: "user with same parameters already exists" });
        let hashedPassword = await hash(password, 15);
        let newUser = new userModel({ userName, password: hashedPassword, identity, email,role });
        await newUser.save();
        let token = generateToken(newUser);
        return res.json({ token, userName: newUser.userName, email: newUser.email });
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find({}, "-password");
        res.json(allUsers);
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}

export const login = async (req, res) => {
    let validate = userValidatorForLogin(req.body);
    if (validate.error)
        return res.status(400).json({ type: "not valid body", messafe: validate.error.details[0].message });
    let { userName, password, identity, email } = req.body;
    try {
        let user = await userModel.findOne({ userName:userName });
        if (!user || !await compare(password, user.password))
            return res.status(404).json({ type: "no such user", message: "please sing up" });
        let token = generateToken(user);
        return res.json({ token, userName: user.userName, email: user.email });
    } catch (err) {
        res.status(400).json({ type: "error", message: err.message });
    }
}