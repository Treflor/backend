var express = require('express');
var router = express.Router();
var passport = require('passport');

const journeyController = require('../../../controllers/journey');

const passportJWT = passport.authenticate('jwt', { session: false });
// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/insert').post(passportJWT, journeyController.insertJourney);

module.exports = router;