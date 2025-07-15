import express from "express";
import { 
  getAllPosts, 
  getUserPosts, 
  getPostsByUserId,
  getSinglePost, 
  createPost, 
  updatePost, 
  deletePost, 
  deletePostImage,
  likePost, 
  unlikePost 
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/user/:userId", getPostsByUserId);

// Protected routes - specific routes first
router.get("/user/posts", authMiddleware, getUserPosts);
router.post("/", authMiddleware, upload.array('images', 5), createPost);

// Dynamic routes - these should come after specific routes
router.get("/:id", getSinglePost);
router.put("/:id", authMiddleware, upload.array('images', 5), updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.delete("/:id/images/:imageIndex", authMiddleware, deletePostImage);
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/unlike", authMiddleware, unlikePost);

export default router;
