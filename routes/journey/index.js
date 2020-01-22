var express = require('express');
var router = express.Router();
var passport = require('passport');

const journeyController = require('../../controllers/journey');
const passportJWT = passport.authenticate('jwt', { session: false });

// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/').post(passportJWT, journeyController.insertJourney);
router.route('/').get(journeyController.getAllPublishedJourney);
router.route('/all').get(passportJWT, journeyController.getAllJourney);
router.route('/unpublished').get(passportJWT, journeyController.getAllUnpublishedJourney);
router.route('/:journeyId').get(passportJWT, journeyController.getJourney);
router.route('/publish/:journeyId').post(passportJWT, journeyController.publishJourney);
router.route('/:journeyId/addFavorite').put(passportJWT, journeyController.addFavoriteJourney);
router.route('/:journeyId/removeFavorite').put(passportJWT, journeyController.removeFavoriteJourney);

module.exports = router;