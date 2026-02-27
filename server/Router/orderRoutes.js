import express from "express";
import { placeNewOrder } from "../Controllers/orderController.js";
import {
  isAuthenticated,
  authorizedRoles
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/new", isAuthenticated, placeNewOrder);

export default router;
