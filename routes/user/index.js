var express = require('express');
var router = express.Router();
var passport = require('passport');

const passportConf = require('../../passport');
const userController = require('../../controllers/user')

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/info').get(passportJWT, userController.currentUser);

router.route('/edit').post(passportJWT, userController.editUser);

module.exports = router;