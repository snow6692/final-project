import { Router, RequestHandler } from "express";
import { protect } from "../auth/auth.middleware";
import { getUserById, deleteUserById } from "../controllers/user.controller";
const router = Router();
router.get(
    "/",
    protect as RequestHandler,
    getUserById as RequestHandler<{}, any, any, {}, {}>
  );
  router.delete(
    "/",
    protect as RequestHandler,
    deleteUserById as RequestHandler<{}, any, any, {}, {}>
  );
export default router;
