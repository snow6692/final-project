import express from "express";
import upload from "../utils/multer";
import {
  createImage,
  deleteImageById,
  updateImageById,
  getImageById,
  getImagesByCategory,
  getImagesByUserId,
} from "../controllers/image";
import { protect } from "../auth/auth.middleware";

const router = express.Router();

// router.post("/", protect, upload.single("image"), createImage);

// router.delete("/:id", isAuthenticated, deleteImageById);

// router.patch("/:id", isAuthenticated, upload.single("image"), updateImageById);

// router.get("/:id", isAuthenticated, getImageById);

// router.get("/category/:categoryId", isAuthenticated, getImagesByCategory);

// router.get("/user/:userId", isAuthenticated, getImagesByUserId);

export default router;
