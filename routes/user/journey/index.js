var express = require('express');
var router = express.Router();
var passport = require('passport');

const journeyController = require('../../../controllers/journey');

const passportJWT = passport.authenticate('jwt', { session: false });
// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/').post(passportJWT, journeyController.insertJourney);
router.route('/').get(passportJWT, journeyController.getAllPublishedJourney);
router.route('/all').get(passportJWT, journeyController.getAllJourney);
router.route('/unpublished').get(passportJWT, journeyController.getAllUnpublishedJourney);
router.route('/:journeyId').get(passportJWT, journeyController.getJourney);

module.exports = router;