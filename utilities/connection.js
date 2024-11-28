let mongoose = require('mongoose');
let mongoconnection = mongoose.createConnection(process.env.MONGO_URI);
module.exports = mongoconnection;