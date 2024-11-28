
var express = require('express');
var router = express.Router();
var mongoconnection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var usermodel = require('../../models/user.model');
var middleware = require('../../middleware/auth'); // Assuming this has the validateToken function
var helper = require('../../utilities/helper');
const asyncHandler = require("express-async-handler");
// Add Task Route
exports.size = asyncHandler(async (req, res) => {
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
            size: [{
                small: req.body.small,
                medium: req.body.medium,
                large: req.body.large
            }]
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


            // Generate a new token for the task owner (optional step, you may choose not to do this)
            // new token generate mate
            // const newToken = await middleware.generateToken({ userId: product.userId });

            res.status(200).json({
                message: 'product size  added successfully!',
                Data: product,
                // token: token // Optionally send back a new token
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred while adding the task' });
    }
});
