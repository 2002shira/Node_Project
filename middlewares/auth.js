import jwt from "jsonwebtoken";
export const userAuth = async (req, res, next) => {
    let token = req.headers["x-token"];
    if (!token)
        return res.status(403).json({ type: "not authorized", message: "user not authorized" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_STRING);
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ type: "not authorized", message: "user not authorized" })
    }
}

export const authAdmin = async (req, res, next) => {
    let token = req.headers["x-token"];
    if (!token)
        return res.status(403).json({ type: "not authorized", message: "user not authorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_STRING);
        console.log(decoded)
        req.user = decoded;
        if (decoded.role  === "ADMIN")
            next();
        else{
            return res.status(403).send("you are not permitted")
             console.log("User does not have ADMIN role");

            }
    } catch (err) {
        return res.status(401).json({ type: "not authorized", message: "user not authorized" })
    }
}
