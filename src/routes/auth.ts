import { Router } from "express";
import { isAuthenticated, login, logout } from "../controllers/auth";

const router = Router();

router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

router.get("/dash", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard!", user: req.user });
});

router.get("/test", (req, res) => {
  console.log(req.session); // Check the session data
  res.json(req.session);
});

export default router;
