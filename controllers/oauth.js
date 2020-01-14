const JWT = require('jsonwebtoken');
var mimeTypes = require('mimetypes');
const config = require('../configuration');
const User = require('../models/user');
const storage = require('../services/cloud-storage');

signToken = (user) => {
    return JWT.sign({
        id: user.id,
    }, config.JWT_SECRET);
}

module.exports = {
    googleOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token, success: true, message: "success" });
    },

    signUp: async (req, res, next) => {
        const user = req.value.body;

        // Check if there is a user with the same email
        let foundUser = await User.findOne({ "email": user.email });
        console.log(foundUser);
        if (foundUser && foundUser.local == true) {
            return res.status(403).json({ error: 'Email is already in use' });
        }

        // Is there a Google account with the same email?
        storage.storeFile(Buffer.from(user.photo, "base64"), 'profile-pics', user.email, async (err, url) => {
            if (err) {
                console.log("failed to upload profile pic");
                console.log(err);
                return res.status(500).json({ success: false, msg: "failed to upload profile pic" });
            }

            // merge details and return token
            // TODO: security issue?? enyone can log in to a gmail signed user
            if (foundUser) {
                foundUser.local = true;
                foundUser.password = user.password;
                foundUser.family_name = user.family_name;
                foundUser.given_name = user.given_name;
                foundUser.photo = url;
                foundUser.gender = user.gender;
                foundUser.birthday = user.birthday

                await foundUser.save();
                // Generate the token
                const token = signToken(foundUser);
                // Respond with token
                return res.status(200).json({ token });
            }
            // create new user
            const newUser = new User({
                local: true,
                email: user.email,
                password: user.password,
                family_name: user.family_name,
                given_name: user.given_name,
                photo: url,
                gender: user.gender,
                birthday: user.birthday
            });
            await newUser.save();
            // Generate the token
            const token = signToken(newUser);
            // Respond with token
            res.status(200).json({ token });
        });
    },

    signIn: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        // Respond with token
        res.status(200).json({ token });
    },
}