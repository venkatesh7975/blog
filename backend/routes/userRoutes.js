import express from "express";
import { onRegister, onLogin, getUserProfile, uploadProfilePicture, deleteProfilePicture, followUser, unfollowUser, getUserById } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", onRegister);
router.post("/login", onLogin);

// Protected routes
router.get("/profile", authMiddleware, getUserProfile);
router.post("/profile-picture", authMiddleware, upload.single('profilePicture'), uploadProfilePicture);
router.delete("/profile-picture", authMiddleware, deleteProfilePicture);
router.post("/follow/:userId", authMiddleware, followUser);
router.post("/unfollow/:userId", authMiddleware, unfollowUser);
router.get("/:userId", getUserById);

export default router;
