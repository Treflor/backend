const JWT = require('jsonwebtoken');
const config = require('../configuration');

signToken = user => {
    return JWT.sign({
        id: user.id,
    }, config.JWT_SECRET);
}

module.exports = {
    googleOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
}