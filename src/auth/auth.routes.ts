import express from "express";
import { signup } from "./auth.controller";

const router = express.Router();

// Signup Route
router.post("/signup", signup);

export default router;
