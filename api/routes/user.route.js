import express from "express";
import { getUserListing, test, getUser } from "../controllers/user.contorller.js";
import { updateUser, deleteUser } from "../controllers/user.contorller.js";
import { verifyToken } from "../utils/varifyUser.js";

const router = express.Router();

// write routes here

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);
router.get("/:id", verifyToken, getUser)

export default router;