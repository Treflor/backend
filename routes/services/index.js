var express = require('express');
var router = express.Router();
var passport = require('passport');

const passportConf = require('../../security/passport');

const passportJWT = passport.authenticate('jwt', { session: false });

const google = require('./google');

router.use('/google', passportJWT, google)

module.exports = router;