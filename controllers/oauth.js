const JWT = require('jsonwebtoken');
const config = require('../configuration');
const User = require('../models/user');

signToken = (user, method) => {
    return JWT.sign({
        id: user.id,
        method: method,
    }, config.JWT_SECRET);
}

module.exports = {
    googleOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user, 'google');
        res.status(200).json({ token });
    },

    signUp: async (req, res, next) => {
        const user = req.value.body;

        // Check if there is a user with the same email
        let foundUser = await User.findOne({ "local.email": user.email });
        if (foundUser) {
            return res.status(403).json({ error: 'Email is already in use' });
        }

        // Is there a Google account with the same email?
        foundUser = await User.findOne(
            { "google.email": user.email },
        );

        if (foundUser) {
            // Let's merge them?
            foundUser.methods.push('local')
            foundUser.local = {
                email: user.email,
                password: user.password,
                family_name: user.family_name,
                given_name: user.given_name,
                photo: user.photo,
            }
            await foundUser.save()
            // Generate the token
            const token = signToken(foundUser, 'local');
            // Respond with token
            return res.status(200).json({ token });
        }

        // Create a new user
        const newUser = new User({
            methods: ['local'],
            local: {
                email: user.email,
                password: user.password,
                family_name: user.family_name,
                given_name: user.given_name,
                photo: user.photo,
            }
        });

        await newUser.save();

        // Generate the token
        const token = signToken(newUser, 'local');
        // Respond with token
        res.status(200).json({ token });
    },

    signIn: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        // Respond with token
        res.status(200).json({ token });
    },

}