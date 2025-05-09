import express, { RequestHandler } from "express";
import {
  createSchedule,
  getUserSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/schedule.controller";
import { protect } from "../auth/auth.middleware";

const router = express.Router();

router.post("/", protect as RequestHandler, createSchedule as RequestHandler);
router.get("/", protect as RequestHandler, getUserSchedules as RequestHandler);
router.patch(
  "/:id",
  protect as RequestHandler,
  updateSchedule as RequestHandler
);
router.delete(
  "/:id",
  protect as RequestHandler,
  deleteSchedule as RequestHandler
);

export default router;
