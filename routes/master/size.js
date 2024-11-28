var express = require('express');
var router = express.Router();
const addproduct = require('../../controllers/master/size');
router.post('/', addproduct.size);
module.exports = router;