module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    oauth: {
        google: {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        }
    }
};