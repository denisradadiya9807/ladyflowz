var express = require('express');
var router = express.Router();
const saveuserctrl = require('../../controllers/admin/register');
router.post('/', saveuserctrl.saveuser);
module.exports = router;