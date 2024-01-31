import mongoose from "mongoose";
export const connectToDB = async () => {
    try {
        let connect = await mongoose.connect(process.env.DB_CONNECTION);
        console.log("mongoDB connected successfully!!!", connect.connection.host);
    } catch (err) {
        console.log("cannot connect to mongoDB");
        console.log(err);
        process.exit(1);
    }
}