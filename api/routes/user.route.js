import express from "express";
import { test } from "../controllers/user.contorller.js";

const router = express.Router();

// write routes here

router.get("/test", test);

export default router;