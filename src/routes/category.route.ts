import { RequestHandler, Router } from "express";
import { getAllCategories, getCategoryById } from "../controllers/category";
import upload from "../utils/multer";
import { protect } from "../auth/auth.middleware";

const router = Router();

router.get("/", protect as RequestHandler, getAllCategories as RequestHandler);
router.get(
  "/:id",
  protect as RequestHandler,
  getCategoryById as RequestHandler
);

export default router;
