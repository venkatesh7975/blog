import express from "express";
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all comments for a specific post (public)
router.get("/post/:postId", getCommentsByPost);

// Create a comment (protected)
router.post("/", authMiddleware, createComment);

// Update a comment by id (protected)
router.put("/:id", authMiddleware, updateComment);

// Delete a comment by id (protected)
router.delete("/:id", authMiddleware, deleteComment);

export default router;
