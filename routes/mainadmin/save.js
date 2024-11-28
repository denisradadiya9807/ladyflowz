var express = require('express');
var router = express.Router();
const addproduct = require('../../controllers/mainadmin/save');
router.post('/', addproduct.saveuser);
module.exports = router;