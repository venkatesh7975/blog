import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";
import fs from 'fs';
import path from 'path';

export async function onRegister(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email, passwordhash: hashedPassword });
    
    const result = await user.save();
    await sendMail(email);
    
    res.status(201).json({ message: "User registered successfully", user: { email: result.email, _id: result._id } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
}

export async function onLogin(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordhash);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "7d" });
    
    res.json({ 
      token: token,
      user: { email: user.email, _id: user._id }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Failed to login", error: err.message });
  }
}

// GET /user/profile - Get current user profile
export async function getUserProfile(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("-passwordhash")
      .populate("followers", "email profilePicture")
      .populate("following", "email profilePicture");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
}

// POST /user/profile-picture - Upload profile picture
export async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldImagePath = path.join(process.cwd(), 'uploads', path.basename(user.profilePicture));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new profile picture path
    const imageUrl = `/uploads/${req.file.filename}`;
    user.profilePicture = imageUrl;
    await user.save();

    res.json({ 
      message: "Profile picture uploaded successfully",
      profilePicture: imageUrl
    });
  } catch (err) {
    console.error("Upload profile picture error:", err);
    res.status(500).json({ message: "Failed to upload profile picture", error: err.message });
  }
}

// DELETE /user/profile-picture - Delete profile picture
export async function deleteProfilePicture(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: "No profile picture to delete" });
    }

    // Delete file from server
    const imagePath = path.join(process.cwd(), 'uploads', path.basename(user.profilePicture));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove from database
    user.profilePicture = null;
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (err) {
    console.error("Delete profile picture error:", err);
    res.status(500).json({ message: "Failed to delete profile picture", error: err.message });
  }
}

// POST /user/follow/:userId - Follow a user
export async function followUser(req, res) {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);
    
    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });

    res.json({ message: "User followed successfully" });
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ message: "Failed to follow user", error: err.message });
  }
}

// POST /user/unfollow/:userId - Unfollow a user
export async function unfollowUser(req, res) {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);
    
    // Check if not following
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following and followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(500).json({ message: "Failed to unfollow user", error: err.message });
  }
}

// GET /user/:userId - Get user profile by ID
export async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .select("-passwordhash")
      .populate("followers", "email profilePicture")
      .populate("following", "email profilePicture");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
}


