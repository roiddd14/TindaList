// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_env_secret";
const COOKIE_NAME = "token";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash });
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // 🔥 FIXED FOR VERCEL ↔ RENDER CROSS-SITE COOKIE
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.status(201).json({
      message: "Registered",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // 🔥 FIXED FOR VERCEL ↔ RENDER CROSS-SITE COOKIE
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "none",
    secure: true
  });
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    const updates = {};
    if (name) updates.name = name;
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(409).json({ message: "Email already in use" });
      }
      updates.email = email;
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true
    }).select("-password");

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Both current and new password are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ message: "Current password incorrect" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    console.error("changePassword error:", err);
    res.status(500).json({ message: "Password change failed" });
  }
};
