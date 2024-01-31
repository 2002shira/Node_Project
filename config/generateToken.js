import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    let jwtSecretKey = process.env.JWT_STRING;
    let data = {
        userName: user.userName,
        identity: user.identity,
        role:user.role,
        _id:user._id
    }
    const token=jwt.sign(data,jwtSecretKey,{
        expiresIn:'30minutes'
    });
    return token;
}