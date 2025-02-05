import express from "express";
import {
  createOutfit,
  getUserOutfits,
  deleteOutfit,
} from "../controllers/outfit";

const router = express.Router();

router.post("/", createOutfit);
router.get("/", getUserOutfits);
router.delete("/:id", deleteOutfit);

export default router;
