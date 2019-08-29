const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

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
        req.user = user;
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.use('google',
    new GooglePlusTokenStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: config.oauth.google.clientID,
        clientSecret: config.oauth.google.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            // //finding the already exist user
            // const existingUser = await User.findOne({ 'google.id': profile.id });

            // if (existingUser) return done(null, existingUser);

            // var newUser = new User({
            //     method: 'google',
            //     google: {
            //         id: profile.id,
            //         email: profile.emails[0].value,
            //         given_name: profile.name.givenName,
            //         family_name: profile.name.familyName,
            //         photo: profile.photos[0].value
            //     }
            // });
            // await newUser.save();
            done(null, 1);
        } catch (err) {
            done(err, false, err.message);
        }
    })
);
