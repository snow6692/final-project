import express, { RequestHandler } from "express";
import {
  createOutfit,
  getUserOutfits,
  deleteOutfit,
  updateOutfit,
} from "../controllers/outfit.controller";
import { protect } from "../auth/auth.middleware";

const router = express.Router();

router.post("/", protect as RequestHandler, createOutfit as RequestHandler);
router.get("/", protect as RequestHandler, getUserOutfits as RequestHandler);
router.patch("/:id", protect as RequestHandler, updateOutfit as RequestHandler);
router.delete(
  "/:id",
  protect as RequestHandler,
  deleteOutfit as RequestHandler
);

export default router;
