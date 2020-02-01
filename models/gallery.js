const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    img0: {
        type: String,
    },
    img1: {
        type: String,
    },
    img2: {
        type: String,
    },
    img3: {
        type: String,
    },
    img4: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    delete: {
        type: Boolean,
        default: false,
        select:false
    },
});

const gallery = mongoose.model('gallery', gallerySchema);

module.exports = gallery;