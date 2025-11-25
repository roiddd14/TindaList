import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getProducts);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;