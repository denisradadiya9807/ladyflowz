var express = require('express');
var router = express.Router();
var connection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var helper = require('../../utilities/helper');
var userModel = require('../../models/user.model');
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const bcrypt = require('bcrypt');
const mongoconnection = require('../../utilities/connection');
exports.login = async (req, res) => {
    let primary = mongoconnection.useDb(constant.defaultDb);
    let obj = {
        email: req.body.email,
        password: req.body.password
    };
    try {
        let userdata = await primary.model(constant.Model.demo, userModel).findOne({ email: req.body.email });
        if (userdata === null) {
            return res.status(404).json({ message: 'user not found' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, userdata.password); // Import bcrypt if not already

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let token = await helper.generateAccessToken({ userId: userdata.id.toString() });
        res.status(200).json({
            message: 'Login Successful',
            token: token,
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ mesage: 'internal Server' });
    }
};

