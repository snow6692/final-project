import { Router } from "express";
import { createUser, getCurrentUser, updateUser } from "../controllers/user";

const router = Router();

// 🟢 Routes
// i will make it in controller name the function
router.post("/register", createUser);
router.put("/update", updateUser);
router.get("/current-user", getCurrentUser);
export default router;
