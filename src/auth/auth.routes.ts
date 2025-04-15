import express from "express";
import { RequestHandler, Response } from "express";
import { logout, signIn, signUp } from "./auth.controller";
import passport from "./passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { CustomRequest } from "../types/express";
import { userTypes } from "../types/user.types";
import prisma from "../config/prisma";

// Define the callback handler with simpler typing
const googleCallbackHandler = async (req: CustomRequest, res: Response) => {
  const userFromReq = req.user as userTypes;

  // Fetch the user manually to ensure relations are included
  const user = await prisma.user.findUnique({
    where: { id: userFromReq.id },
    include: {
      images: true,
      notifications: true,
      outfits: true,
      sessions: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
  const { password, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
};
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }) as RequestHandler
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }) as RequestHandler,
  googleCallbackHandler as RequestHandler // Cast the handler to RequestHandler
);

router.post("/signup", signUp as RequestHandler);
router.post("/signin", signIn as RequestHandler);
router.post("/logout", logout as RequestHandler);
export default router;
