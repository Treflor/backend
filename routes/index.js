
var express = require('express');
var router = express.Router();
var passport = require('passport');

const passportConf = require('../security/passport');

const oauth = require('./oauth');
const user = require('./user');
const services = require('./services');
const guides = require('./guides')
const journey = require('./journey');

const passportJWT = passport.authenticate('jwt', { session: false });

router.use('/oauth', oauth);
router.use('/user', passportJWT, user);
router.use('/services', passportJWT, services);
router.use('/guides', passportJWT, guides);
router.use('/journey', passportJWT, journey);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Treflor APIs' });
});

module.exports = router;