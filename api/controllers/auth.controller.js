import UserModule from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandle } from "../utils/error.js";
import jwt from "jsonwebtoken";

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
};

export const signIn = async (req, res , next) => {
    const {email, password} = req.body;
    try{
        const validUser = await UserModule.findOne({email});
        if(!validUser) return next(errorHandle(404, "user not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandle(401, "Wrong Credentials!"));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRECT);
        const {password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }catch(error){
        next(error);
    }
}