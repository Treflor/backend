var express = require('express');
var router = express.Router();

const google = require('./google');

router.use('/google', google)

module.exports = router;