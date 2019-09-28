const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const config = require('./configuration');

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
    new GooglePlusTokenStrategy({
        clientID: config.oauth.google.clientID,
        clientSecret: config.oauth.google.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            //finding the already exist user
            let existingUser = await User.findOne({ 'google.id': profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }

            // check for email in local
            existingUser = await User.findOne({ "local.email": profile.emails[0].value });
            if (existingUser) {
                existingUser.methods.push('google');
                existingUser.google = {
                    id: profile.id,
                    email: profile.emails[0].value,
                    given_name: profile.name.givenName,
                    family_name: profile.name.familyName,
                    photo: profile.photos[0].value,
                    gender: "Select",
                    birthday: 0,
                }
                await existingUser.save();
                return done(null, existingUser);
            }

            var newUser = new User({
                methods: ['google'],
                google: {
                    id: profile.id,
                    email: profile.emails[0].value,
                    given_name: profile.name.givenName,
                    family_name: profile.name.familyName,
                    photo: profile.photos[0].value,
                    gender: "Select",
                    birthday: 0,
                }
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
        const user = await User.findOne({ "local.email": email });

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