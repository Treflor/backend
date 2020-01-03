var axios = require('axios');

const configs = require("../../configuration");

const directionApiURL = "https://maps.googleapis.com/maps/api/directions/json";

module.exports = {
    fetchDirection: async (req, res) => {
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
    }
}