import express from "express";
import {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all posts (public)
router.get("/", authMiddleware,getAllPosts);

// Get single post by id (public)
router.get("/:id", getSinglePost);

// Create a new post (protected)
router.post("/", authMiddleware, createPost);

// Update a post by id (protected)
router.put("/:id", authMiddleware, updatePost);

// Delete a post by id (protected)
router.delete("/:id", authMiddleware, deletePost);

export default router;
