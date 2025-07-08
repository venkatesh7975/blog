import Post from "../models/Post.js";

// GET /posts?search=&sort=&page=&limit=
export const getAllPosts = async (req, res) => {
  try {
    const {
      search = "",
      sort = "-createdAt",
      page = 1,
      limit = 10,
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
      .populate("userId", "email");

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({ posts, totalPosts, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get posts", error: error.message });
  }
};

// GET /posts/:id
export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("userId", "email");
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
    // Assuming you have userId from auth middleware (e.g., req.user._id)
    const userId = req.user._id;

    const post = new Post({ title, content, userId });
    const savedPost = await post.save();

    res.status(201).json(savedPost);
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

    const updatedPost = await post.save();

    res.json(updatedPost);
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
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don't have permission to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};
