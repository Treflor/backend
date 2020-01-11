var express = require('express');
var router = express.Router();
var passport = require('passport');

const passportConf = require('../../security/passport');
const guidesController = require('../../controllers/guides');
// const { validateBody, schemas } = require('../../helpers/validators');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/').get(passportJWT, guidesController.getAllGuides);

router.route('/:guideId').get(passportJWT, guidesController.getGuide);

// router.route('/').post(passportJWT, validateBody(schemas.updateUserSchema), guidesController.editUser);
router.route('/').post(passportJWT, guidesController.createGuide);

module.exports = router;