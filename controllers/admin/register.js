var express = require('express');
var router = express.Router();
var mongoconnection = require('../../utilities/connection');
var constant = require('../../utilities/constant');
var usermodel = require('../../models/user.model');
const bcrypt = require('bcrypt');
exports.saveuser = async (req, res) => {
    let primary = mongoconnection.useDb(constant.defaultDb);

    const saltRounds = 10; // Adjust saltRounds as needed for security
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        let obj = {
            email: req.body.email,
            password: hashedPassword,
        };
        let existingUser = await primary.model(constant.Model.demo, usermodel).findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ message: 'this email already exists' });
        }
        let newuser = await primary.model(constant.Model.demo, usermodel).create(obj);
        res.status(200).json({
            message: 'New Data Add Successfully...',
            Data: newuser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving user' });
    }

}
