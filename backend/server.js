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

// Allowed origins (frontend URLs)
const allowedOrigins = [
  process.env.FRONTEND_URL,   // Vercel domain
  "http://localhost:5173"     // Local dev
];

app.use(express.json());
app.use(cookieParser());

// CORS FIX — supports multiple origins
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for origin: " + origin), false);
    },
    credentials: true,
  })
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
