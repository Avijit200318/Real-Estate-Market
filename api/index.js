import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

// initialize dotenv
dotenv.config();

mongoose.connect(process.env.mongo).then(() => {
    console.log("mongodb is connected");
}).catch((err) => {
    console.log(err);
});

const app = express();

// allow send json to the server
app.use(express.json());

app.listen(3000, function() {
    console.log("server is running at port 3000");
})

// create routes
app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);