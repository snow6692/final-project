import { Router, RequestHandler } from "express";
import { protect } from "../auth/auth.middleware";
import {
  getUserById,
  deleteUserById,
  updateUserById,
  changePassword,
} from "../controllers/user.controller";
import upload from "../utils/multer";

const router = Router();

router.get("/", protect as RequestHandler, getUserById as RequestHandler);
router.delete("/", protect as RequestHandler, deleteUserById as RequestHandler);
router.patch(
  "/",
  protect as RequestHandler,
  upload.single("image"),
  updateUserById as RequestHandler
);
router.patch(
  "/password",
  protect as RequestHandler,
  changePassword as RequestHandler
);

export default router;
