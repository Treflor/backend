const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-id-token');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const config = require('../configuration');

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET,
    passReqToCallback: true
}, async (req, payload, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payload.id);

        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        //edited
        // Otherwise, return the user
        user.method = payload.method;
        req.user = user;
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('google',
    new GoogleTokenStrategy({
        clientID: config.oauth.google.clientID,
        clientSecret: config.oauth.google.clientSecret,
    }, async (parsedToken, googleToken, done) => {
        var profile = parsedToken.payload;
        try {
            //finding the already exist user
            let existingUser = await User.findOne({ 'googleId': profile.sub });
            if (existingUser) {
                return done(null, existingUser);
            }

            // check for email in locally signed up?
            existingUser = await User.findOne({ "email": profile.email });
            if (existingUser) {
                existingUser.googleId = profile.sub;
                existingUser.given_name = profile.given_name;
                existingUser.family_name = profile.family_name;
                existingUser.photo = profile.picture;

                await existingUser.save();
                return done(null, existingUser);
            }

            var newUser = new User({
                googleId: googleToken,
                email: profile.email,
                given_name: profile.given_name,
                family_name: profile.family_name,
                photo: profile.picture,
            });
            await newUser.save();
            done(null, newUser);
        } catch (err) {
            done(err, false, err.message);
        }
    })
);

// local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({ "email": email });

        // If not, handle it
        if (!user) {
            return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // If not, handle it
        if (!isMatch) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));