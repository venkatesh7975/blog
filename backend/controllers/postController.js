import Post from "../models/Post.js";
import fs from 'fs';
import path from 'path';

// GET /posts?search=&sort=&page=&limit=
export const getAllPosts = async (req, res) => {
  try {
    const {
      search = "",
      sort = "-createdAt",
      page = 1,
      limit = 6,
    } = req.query;
    

    const query = {};
    if (search) {
      // Simple case-insensitive search on title or content
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "email profilePicture");

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts, totalPosts, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get posts", error: error.message });
  }
};

// GET /posts/user - Get current user's posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find({ userId })
      .sort("-createdAt")
      .populate("userId", "email profilePicture");

    res.json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user posts", error: error.message });
  }
};

// GET /posts/:id
export const getSinglePost = async (req, res) => {

  try {
    const post = await Post.findById(req.params.id).populate("userId", "email profilePicture");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get post", error: error.message });
  }
};

// POST /posts
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Handle uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const post = new Post({ title, content, userId, images });
    const savedPost = await post.save();
    
    const populatedPost = await Post.findById(savedPost._id).populate("userId", "email profilePicture");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

// PUT /posts/:id
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Optional: check if the user owns the post
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to update this post" });
    }

    post.title = title ?? post.title;
    post.content = content ?? post.content;

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      post.images = [...post.images, ...newImages];
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate("userId", "email profilePicture");

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error: error.message });
  }
};

// DELETE /posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Optional: check if the user owns the post
    if (!post.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "You don't have permission to delete this post" });
    }

    // Delete associated images
    if (post.images && post.images.length > 0) {
      post.images.forEach(imagePath => {
        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// DELETE /posts/:id/images/:imageIndex - Delete specific image from post
export const deletePostImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const post = await Post.findById(id);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "You don't have permission to delete this image" });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= post.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    // Delete file from server
    const imagePath = post.images[index];
    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Remove from array
    post.images.splice(index, 1);
    await post.save();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
};

// POST /posts/:id/like - Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    
    // Check if already liked
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // Add like
    post.likes.push(userId);
    await post.save();

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to like post", error: error.message });
  }
};

// POST /posts/:id/unlike - Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    
    // Check if not liked
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: "Post not liked" });
    }

    // Remove like
    post.likes = post.likes.filter(id => !id.equals(userId));
    await post.save();

    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlike post", error: error.message });
  }
};
