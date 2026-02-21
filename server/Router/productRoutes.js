import express from 'express';
import {
    createProduct,
    deleteProduct,
    deleteReview,
    fetchAllProducts,
    fetchSingleProduct,
    postProductReview,
    updateProduct
} from "../Controllers/productController.js";
import {
    authorizedRoles,
    isAuthenticated
} from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/create", isAuthenticated, authorizedRoles("Admin"), createProduct);
router.get("/", fetchAllProducts);
router.get("/singleProduct/:productId", fetchSingleProduct);
router.put("/admin/update/:productId", isAuthenticated, authorizedRoles("Admin"), updateProduct);
router.delete("/admin/delete/:productId", isAuthenticated, authorizedRoles("Admin"), deleteProduct);
router.put("/post-new/review/:productId", isAuthenticated, postProductReview);
router.delete("/delete/review/:productId", isAuthenticated, deleteReview);


export default router;  