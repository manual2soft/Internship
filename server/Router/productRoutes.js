import express from 'express';
import { createProduct } from "../Controllers/productController.js";
import { authorizedRoles, isAuthenticated } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizedRoles("Admin"), createProduct);

export default router;  