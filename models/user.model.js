let mongoose = require('mongoose');
let schema = new mongoose.Schema({
},
    {
        strict: false, autoIndex: true
    }
);
module.exports = schema;