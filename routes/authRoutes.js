import express from "express";
import {
  register,
  login,
  logout,
  googleLogin,
  getCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleLogin);
router.get("/me", protect, getCurrentUser);

export default router;
