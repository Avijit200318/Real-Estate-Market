import UserModule from "../models/user.model.js";
import bcryptjs from "bcryptjs";
// import { errorHandle } from "../utils/error.js";

export const signUp = async function(req, res, next) {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new UserModule({username, email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).json("user created successfully");
    }catch(err) {
        next(err);
        // next(errorHandle(550, "error from the function"));
    }
}