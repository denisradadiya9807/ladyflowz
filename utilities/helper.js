const jwt = require('jsonwebtoken');
exports.generateAccessToken = (userData) => {
    if (!userData) {
        throw new Error('Payload is required to generate a token.');
    }
    return jwt.sign(userData, process.env.JWT_SECRET);
};