import express, { RequestHandler } from "express";
import upload from "../utils/multer";
import {
  createImage,
  deleteImageById,
  updateImageById,
  getImageById,
  getImagesByCategory,
  getImagesByUserId,
} from "../controllers/image.controller";
import { protect } from "../auth/auth.middleware";

const router = express.Router();

router.post(
  "/",
  protect as RequestHandler,
  upload.single("image"),
  createImage as RequestHandler
);

router.delete(
  "/:id",
  protect as RequestHandler,
  deleteImageById as RequestHandler
);

router.patch(
  "/:id",
  protect as RequestHandler,
  upload.single("image"),
  updateImageById as RequestHandler
);

router.get("/:id", protect as RequestHandler, getImageById as RequestHandler);

router.get(
  "/category/:categoryId", // Reverted from :categoryName to :categoryId
  protect as RequestHandler,
  getImagesByCategory as RequestHandler
);

router.get(
  "/user-images",
  protect as RequestHandler,
  getImagesByUserId as RequestHandler
);

export default router;
