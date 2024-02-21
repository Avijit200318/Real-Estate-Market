import express from "express";
import { test } from "../controllers/user.contorller.js";
import { updateUser } from "../controllers/user.contorller.js";
import { verifyToken } from "../utils/varifyUser.js";

const router = express.Router();

// write routes here

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);

export default router;