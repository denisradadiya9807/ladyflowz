
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
        const { taskId } = req.body;

        // Convert to timestamp
        // Proceed with creating the task after token verification
        let obj = {
            producttitle: req.body.producttitle,
            decription: req.body.decription,
            userId: decoded.userId,// Store userId from the token (decoded payload)
            skuId: req.body.skuId,
            date: new Date()
        };
        let productdetail = {
            userId: decoded.userId,
            productstock: req.body.productstock,
            productprice: req.body.productprice,
            discount: req.body.discount
        };


        if (taskId) {
            // Update existing task
            taskResponse = await primary
                .model(constant.Model.product, usermodel)
                .findByIdAndUpdate({ _id: taskId, userId: decoded.userId }, obj);


            if (!taskId) {
                return res.status(404).json({ message: 'Task not found or not authorized to update' });
            }

            taskResponse1 = await primary
                .model(constant.Model.productdetail, usermodel)
                .findByIdAndUpdate({ _id: taskId, userId: decoded.userId }, productdetail);


            if (!taskId) {
                return res.status(404).json({ message: 'Task not found or not authorized to update01' });
            }

            res.status(200).json({
                message: 'Task updated successfully!',
                Data: obj,// Return the updated task
                Data: productdetail,

            });

        } else {


            // Create task in the database
            let product = await primary.model(constant.Model.product, usermodel).create(obj);
            let product1 = await primary.model(constant.Model.productdetail, usermodel).create(productdetail);


            // Generate a new token for the task owner (optional step, you may choose not to do this)
            // new token generate mate
            // const newToken = await middleware.generateToken({ userId: product.userId });

            res.status(200).json({
                message: 'New product added successfully!',
                Data: product,
                Data: product1,

                // token: token // Optionally send back a new token
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while adding the task' });
    }
});



var express = require('express');
var router = express.Router();
var mongoconnection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var usermodel = require('../../models/user.model');
var middleware = require('../../middleware/auth'); // Assuming this has the validateToken function
var helper = require('../../utilities/helper');
const asyncHandler = require("express-async-handler");
// Add Task Route
exports.deletetask = asyncHandler(async (req, res) => {
    let primary = mongoconnection.useDb(constant.defaultDb);
    // Token validation middleware
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        // Validate the token (decode and verify it)
        const decoded = await middleware.validateToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Assuming `decoded.userId` contains the authenticated user's ID
        const userId = decoded.userId;


        // Extract the task ID from the request parameters
        const { taskId } = req.body;
        // Ensure the taskId is provided
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const result = await primary.model(constant.Model.taskadd, usermodel).findOneAndDelete({ _id: taskId, userId: decoded.userId });

        if (result) {
            return res.status(404).json({ message: 'Task not found or not authorized to delete' });
        }

        // Successfully deleted
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while adding the task' });
    }
});
