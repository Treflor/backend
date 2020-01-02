var express = require('express');
var router = express.Router();

const oauth = require('./oauth');
const user = require('./user');
const services = require('./services');

router.use('/oauth', oauth);
router.use('/user', user);
router.use('/services', services);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Treflor APIs' });
});

module.exports = router;
