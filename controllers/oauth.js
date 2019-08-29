const JWT = require('jsonwebtoken');
const config = require('../configuration');

signToken = user => {
    return JWT.sign({
        iss: 'treflor',
        id: 0,
        iat: new Date().getTime(), //current time
        //current time + 30 days ahead
        exp: new Date().setDate(new Date().getDate() + 30)
    }, config.JWT_SECRET);
}

module.exports = {
    googleOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
}