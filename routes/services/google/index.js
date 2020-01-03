var express = require('express');
var router = express.Router();

var googleServicesController = require("../../../controllers/services/google")

// const { validateBody, schemas } = require('../../helpers/validators');
// TODO: check scheme
router.route('/direction').get(googleServicesController.fetchDirection);

module.exports = router;