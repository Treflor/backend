var express = require('express');
var axios = require('axios');
var router = express.Router();
const configs = require("../../../configuration");

// const { validateBody, schemas } = require('../../helpers/validators');
const directionApiURL = "https://maps.googleapis.com/maps/api/directions/json";

router.route('/direction').get(async (req, res) => {
    var origin = req.query.origin;
    var destination = req.query.destination;
    var mode = req.query.mode;

    var response = await axios.get(directionApiURL, {
        params: {
            key: configs.google.apiKey,
            origin: origin,
            destination: destination,
            mode: mode
        }
    });
    
    res.send(response.data)
});

module.exports = router;