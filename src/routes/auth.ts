import passport from "passport";
import { Router } from "express";
import { login, logout } from "../controllers/auth";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

router.get("/dash", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

// Redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard"); // Change to your desired route
  }
);

router.get("/test", (req, res) => {
  console.log(req.session); // Check the session data
  res.json(req.session);
});

export default router;
