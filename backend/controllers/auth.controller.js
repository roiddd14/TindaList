// controllers/auth.controller.js
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_env_secret";
const COOKIE_NAME = "token";

const cookieOptions = {
  httpOnly: true,
  secure: true,           // REQUIRED for Vercel + Render
  sameSite: "none",       // REQUIRED for cross-site cookies
  path: "/",              // Ensure cookies work across all routes
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash });
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      message: "Registered",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  res.json({ message: "Logged out" });
};
