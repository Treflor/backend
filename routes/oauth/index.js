var express = require('express');
var router = express.Router();
const passport = require('passport');

const passportConfig = require('../../passport')
const oauthController = require('../../controllers/oauth')

router.route('/google')
    .post(passport.authenticate('google', { session: false }), oauthController.googleOAuth);

module.exports = router;