var express = require('express');
var router = express.Router();
const deleteproduct = require('../../controllers/mainadmin/deleteproduct');
router.post('/', deleteproduct.deletuser);
module.exports = router;