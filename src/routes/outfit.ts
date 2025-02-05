import express from "express";
import {
  createOutfit,
  getUserOutfits,
  deleteOutfit,
} from "../controllers/outfit";

const router = express.Router();

router.post("/", createOutfit); // ✅ إضافة Outfit جديد
router.get("/", getUserOutfits); // ✅ جلب جميع Outfits للمستخدم
router.delete("/:id", deleteOutfit); // ✅ حذف Outfit معين

export default router;
