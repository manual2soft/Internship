import { catchAsyncErrors } from "../Middleware/catchAsyncError.js";
import ErrorHandler from "../Middleware/errorMiddlewares.js";
import { v2 as cloudinary } from "cloudinary";
import database from "../database/db.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
    const { name, description, price, category, stock } = req.body;
    const createdBy = req.user.id;

    if (!name || !description || !price || !category || !stock) {
        return next(new ErrorHandler("Please provide complete product details.", 400));
    }

    try {

        let uploadedImages = [];

        if (req.files && req.files.images) {
            const images = Array.isArray(req.files.images)
                ? req.files.images
                : [req.files.images];

            for (const image of images) {
                const result = await cloudinary.uploader.upload(image.tempFilePath, {
                    folder: "Ecommerce_Product_Images",
                    width: 1000,
                    crop: "scale",
                });

                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }

        }

        const product = await database.query(
            `INSERT INTO products (name, description, price, category, stock, images, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, description, price, category, stock, JSON.stringify(uploadedImages), createdBy]
        );

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product: product.rows[0],
        });

    } catch (error) {
        return next(new ErrorHandler("Error creating product.", 500));
    }

});  

export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
        const {availability, price, category, rating, search} = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        
});