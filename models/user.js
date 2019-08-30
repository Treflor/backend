const mongoose = require('mongoose');

//scheme can be add more options also
const userScheme = new mongoose.Schema({
    method: {
        type: String,
        enum: ['google'],
        required: true
    },
    google: {
        id: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true
        },
        family_name: {
            type: String
        },
        given_name: {
            type: String
        },
        photo: {
            type: String
        }
    },
});

const User = mongoose.model('user', userScheme);

//Export the user model
module.exports = User;