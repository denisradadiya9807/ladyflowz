
var express = require('express');
var router = express.Router();
var mongoconnection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var usermodel = require('../../models/user.model');
var middleware = require('../../middleware/auth'); // Assuming this has the validateToken function
var helper = require('../../utilities/helper');
var multer = require('multer');
const asyncHandler = require("express-async-handler");
// Add Task Route
exports.saveuser = asyncHandler(async (req, res) => {
    let primary = mongoconnection.useDb(constant.defaultDb);

    // Token validation middleware
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }


    try {
        // Validate the token (decode and verify it)
        const decoded = await middleware.validateToken(token); // Assuming validateToken is async and returns user info
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const { taskId, producttitle, decription, productdetail } = req.body;

        const existingProduct = await primary.model(constant.Model.product, usermodel).findOne({
            producttitle
        });

        if (existingProduct && (!taskId || existingProduct._id.toString() !== taskId)) {
            return res.status(400).json({ message: 'Product title already exists. Please use a different title.' });
        }

        let obj = {
            producttitle: req.body.producttitle,
            decription: req.body.decription,
            userId: decoded.userId,// Store userId from the token (decoded payload)
            date: new Date()
        };

        if (taskId) {
            // Update existing task
            taskResponse = await primary
                .model(constant.Model.product, usermodel)
                .findByIdAndUpdate({ _id: taskId, userId: decoded.userId }, obj);

            if (!taskId) {
                return res.status(404).json({ message: 'Task not found or not authorized to update' });
            }

            res.status(200).json({
                message: 'Task updated successfully!',
                Data: obj,// Return the updated task
            });

        } else {


            // Create task in the database
            let product = await primary.model(constant.Model.product, usermodel).create(obj);

            let pricedetails = [];

            for
                (const detail of productdetail) {
                const pricedetail = {
                    productstock: detail.productstock,
                    productprice: detail.productprice,
                    discount: detail.discount,
                    userId: decoded.userId,
                    skuId: detail.skuId,
                    sizeid: detail.sizeid,
                    productid: product._id // Add the product ID
                };

                // Create the pricedetail in the database
                let savedPriceDetail = await primary.model(constant.Model.productdetail, usermodel).create(pricedetail);
                pricedetails.push(savedPriceDetail);
                // Generate a new token for the task owner (optional step, you may choose not to do this)
                // new token generate mate
                // const newToken = await middleware.generateToken({ userId: product.userId });
            }
            res.status(200).json({
                message: 'New product added successfully!',
                Data: product,
                productdetail: pricedetails,

                // token: token // Optionally send back a new token
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while adding the task' });
    }
});
