import express from "express";
import upload from "../utils/multer"; // ✅ استيراد multer من utils/multer.ts
import { isAuthenticated } from "../middlewares/auth";
import { uploadImage } from "../controllers/image";

const router = express.Router();

router.post("/", isAuthenticated, upload.single("image"), uploadImage); 
// ✅ رفع صورة جديدة
export default router;
