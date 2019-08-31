var express = require('express');
var router = express.Router();

const oauth = require('./oauth');
const user = require('./user');

router.use('/oauth', oauth);
router.use('/user', user);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Treflor APIs' });
});

module.exports = router;
