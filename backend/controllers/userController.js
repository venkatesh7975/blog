import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendEmail.js";

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
    const user = await User.findById(userId).select("-passwordhash");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
}


