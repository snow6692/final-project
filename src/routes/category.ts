import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  updateCategoryById,
  getAllCategories,
  getCategoryById,
} from "../controllers/category";
import upload from "../utils/multer";

const router = Router();

// router.post("/new", isAuthenticated, upload.single("image"), createCategory);
// router.delete("/:id", isAuthenticated, deleteCategory);
// router.patch(
//   "/:id",
//   isAuthenticated,
//   upload.single("image"),
//   updateCategoryById
// );
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

export default router;
