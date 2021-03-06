const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    guide: {
        type: String,
    },
    date: {
        type: Number,
    },
    img: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false
    }
});

const guide = mongoose.model('guide', guideSchema);

module.exports = guide;