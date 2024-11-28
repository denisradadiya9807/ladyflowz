const jwt = require('jsonwebtoken');
// const encrypt=require('encrypt');
// const decrypt=require('decrypt');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'FIRST'; // Make sure this is the same secret you use for signing tokens

// Token Validation Middleware
exports.validateToken = async (token) => {
    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded; // Returns the decoded user data (e.g., userId)
    } catch (error) {
        console.error("Token verification failed:", error);
        return null; // Return null if token is invalid or expired
    }
};

// Optionally, a function to generate a new token (e.g., for the user after creating a task)
exports.generateToken = (user) => {
    return jwt.sign(
        { userId: user.userId },
        SECRET_KEY,
        { expiresIn: '1h' } // Set your preferred expiration time
    );
};


exports.passwordDecryptor = async (passwordKeyDecrypt) => {
    try {
        var decLayer1 = CryptoJS.TripleDES.decrypt(passwordKeyDecrypt, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
        var decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENCRYPTION_SECRET);
        var deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
        var decLayer3 = CryptoJS.AES.decrypt(deciphertext2, process.env.PASSWORD_ENCRYPTION_SECRET);
        var finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
        return finalDecPassword;
    } catch (err) {
        throw err;
    }
};
exports.passwordEncryptor = async (passwordKeyEncrypt) => {
    try {
        var encLayer1 = CryptoJS.AES.encrypt(passwordKeyEncrypt, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var encLayer2 = CryptoJS.DES.encrypt(encLayer1, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        var finalEncPassword = CryptoJS.TripleDES.encrypt(encLayer2, process.env.PASSWORD_ENCRYPTION_SECRET).toString();
        return finalEncPassword;
    } catch (err) {
        throw err;
    }
};