var express = require('express');
var router = express.Router();
var passport = require('passport');

const passportConf = require('../../security/passport');
const userController = require('../../controllers/user');
const { validateBody, schemas } = require('../../helpers/validators');
const journey = require('./journey');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/info').get(passportJWT, userController.currentUser);

router.route('/edit').post(passportJWT, validateBody(schemas.updateUserSchema), userController.editUser);

router.use('/journey', passportJWT, journey);

module.exports = router;