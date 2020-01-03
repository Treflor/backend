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


        var data = {}

        if (response.data.status == "OK") {
            var data = {
                bounds: response.data.routes[0].bounds,
                distance: response.data.routes[0].legs[0].distance,
                duration: response.data.routes[0].legs[0].duration,
                end_address: response.data.routes[0].legs[0].end_address,
                end_location: response.data.routes[0].legs[0].end_location,
                start_address: response.data.routes[0].legs[0].start_address,
                start_location: response.data.routes[0].legs[0].start_location,
                points: response.data.routes[0].overview_polyline.points,
                status: response.data.status,
            };
        }
        else {
            data = {
                status: response.data.status,
            };
        }

        res.send(data)
    }
}