import express from "express";
import { onLogin, onRegister, getUserProfile } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", onRegister);
router.post("/login", onLogin);
router.get("/user/profile", authenticateToken, getUserProfile);

export default router;
