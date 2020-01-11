
var express = require('express');
var router = express.Router();

const oauth = require('./oauth');
const user = require('./user');
const services = require('./services');
const guides = require('./guides')

router.use('/oauth', oauth);
router.use('/user', user);
router.use('/services', services);
router.use('/guides', guides);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Treflor APIs' });
});

module.exports = router;