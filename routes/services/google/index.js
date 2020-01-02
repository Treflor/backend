var express = require('express');
var router = express.Router();

// const { validateBody, schemas } = require('../../helpers/validators');

router.route('/').get((req,res)=>{
    res.send("done");
});

module.exports = router;