import { Router } from "express";
import { createUser, getUser, updateUser } from "../controllers/user";

const router = Router();

// 🟢 Routes
// i will make it in controller name the function
router.post("/register", createUser);
router.get("/getById", getUser);
router.put("/update", updateUser);

export default router;
