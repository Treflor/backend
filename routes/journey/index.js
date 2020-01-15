var express = require('express');
var router = express.Router();

const journeyController = require('../../controllers/journey');

// const { validateBody, schemas } = require('../../helpers/validators');

// router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);
router.route('/').post(journeyController.insertJourney);
router.route('/').get(journeyController.getAllPublishedJourney);
router.route('/all').get(journeyController.getAllJourney);
router.route('/unpublished').get(journeyController.getAllUnpublishedJourney);
router.route('/:journeyId').get(journeyController.getJourney);
router.route('/publish/:journeyId').post(journeyController.publishJourney);

module.exports = router;