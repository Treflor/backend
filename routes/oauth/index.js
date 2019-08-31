var express = require('express');
var router = express.Router();
const passport = require('passport');

const passportConfig = require('../../passport')
const OauthController = require('../../controllers/oauth')
const { validateBody, schemas } = require('../../helpers/validators');

const passportSignIn = passport.authenticate('local', { session: false });

router.route('/google')
    .post(passport.authenticate('google', { session: false }), OauthController.googleOAuth);

router.route('/signup')
    .post(validateBody(schemas.authSignUpSchema), OauthController.signUp);

router.route('/signin')
    .post(validateBody(schemas.authSignInSchema), passportSignIn, OauthController.signIn);


module.exports = router;