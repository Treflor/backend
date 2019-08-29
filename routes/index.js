var express = require('express');
var router = express.Router();

const oauth = require('./oauth');

router.use('/oauth', oauth);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Treflor APIs' });
});

module.exports = router;
