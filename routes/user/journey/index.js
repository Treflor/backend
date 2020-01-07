var express = require('express');
var router = express.Router();

const journeyController = require('../../../controllers/journey');

// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/insert').post(passportJWT, journeyController.insertJourney);

module.exports = router;