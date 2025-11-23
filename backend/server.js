import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- FIXED CORS CONFIG (for Vercel -> Render with cookies) ---
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:5173",
        process.env.FRONTEND_URL,    // your main Vercel prod URL
      ];

      // Allow backend tools (no origin)
      if (!origin) return callback(null, true);

      // Allow ALL Vercel preview deployments
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      // Allow explicitly approved origins
      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// allow preflight
app.options("*", cors());


// Required for preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
