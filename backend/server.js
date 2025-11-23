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

// CORS FIX — allow localhost, the main Vercel URL, & ALL Vercel preview URLs
app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:5173",
        process.env.FRONTEND_URL,  // your main Vercel project domain
      ];

      if (!origin) {
        return callback(null, true); // allow server-to-server or Postman
      }

      // allow all preview URLs: *.vercel.app
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for origin: " + origin), false);
    },
    credentials: true,
  })
);

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
