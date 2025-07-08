import Comment from "../models/Comment.js";

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to get comments", error: error.message });
  }
};

// Create a comment on a post
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user._id; // from auth middleware

    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" });
    }

    const comment = new Comment({ postId, userId, content });
    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment", error: error.message });
  }
};

// Update a comment by id
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.content = content ?? comment.content;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error: error.message });
  }
};

// Delete a comment by id
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};
