const mongoose = require('mongoose');

const landmarkSchema = new mongoose.Schema({
    images: {
        type: [
            String
        ]
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    snippet: {
        type: String
    },
    title: {
        type: String
    },
    type: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    journey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'journey',
        required: true
    },
});

const landmark = mongoose.model('landmark', landmarkSchema);

module.exports = landmark;