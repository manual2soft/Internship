import express from "express";
import {
    dashboardStats,
    deleteUser,
    getAllUsers
} from "../Controllers/adminController.js";
import {
    authorizedRoles,
    isAuthenticated,
} from "../Middleware/authMiddleware.js";


const router = express.Router();

router.get("/getallusers", isAuthenticated, authorizedRoles("Admin"), getAllUsers); //DASHBOARD
router.delete("/delete/:id", isAuthenticated, authorizedRoles("Admin"), deleteUser);
router.get("/fetch/dashboard-stats", isAuthenticated, authorizedRoles("Admin"), dashboardStats);

export default router;

