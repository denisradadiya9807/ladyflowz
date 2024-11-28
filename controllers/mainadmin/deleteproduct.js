
var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var mongoconnection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var usermodel = require('../../models/user.model');
var middleware = require('../../middleware/auth'); // Assuming this has the validateToken function
var helper = require('../../utilities/helper');
var multer = require('multer');
const asyncHandler = require("express-async-handler");
exports.deletuser = asyncHandler(async (req, res) => {
    let primary = mongoconnection.useDb(constant.defaultDb);

    // Extract token from Authorization header
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Validate the token
        const decoded = await middleware.validateToken(token); // Assuming validateToken returns decoded user info
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { productid } = req.body; // Extract productId from request body

        if (!productid) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if the product exists and belongs to the user
        const product = await primary
            .model(constant.Model.product, usermodel)
            .findOneAndDelete({ _id: new mongoose.Types.ObjectId(productid) });


        if (!product) {
            return res.status(404).json({ message: 'Product not found or not authorized to delete' });
        }
        const product1 = await primary
            .model(constant.Model.productdetail, usermodel)
            .deleteMany({ productid: new mongoose.Types.ObjectId(productid) });
        if (!product1) {
            return res.status(404).json({ message: 'Product detail not found or not authorized to delete' });
        }


        res.status(200).json({
            message: 'Product and associated details deleted successfully',
        });
    } catch (error) {
        console.error('Error while deleting product:', error);
        res.status(500).json({ message: 'Error occurred while deleting the product' });
    }
});
