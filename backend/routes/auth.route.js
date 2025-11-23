// routes/auth.route.js
import express from "express";
import { register, login, logout, me, updateUser, changePassword } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

// New endpoints
router.put("/update", requireAuth, updateUser);
router.put("/change-password", requireAuth, changePassword);

export default router;
