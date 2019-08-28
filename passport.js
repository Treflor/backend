const passport = require('passport');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const JWTStrategy = require('passport-jwt').Strategy;

const config = require('./configuration');

passport.use(new JwtStrategy({
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

// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: config.oauth.google.clientID,
    clientSecret: config.oauth.google.clientSecret,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Could get accessed in two ways:
        // 1) When registering for the first time
        // 2) When linking account to the existing one

        // Should have full user profile over here
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        if (req.user) {
            // We're already logged in, time for linking account!
            // Add Google's data to an existing account
            req.user.methods.push('google')
            req.user.google = {
                id: profile.id,
                email: profile.emails[0].value
            }
            await req.user.save()
            return done(null, req.user);
        } else {
            // We're in the account creation process
            let existingUser = await User.findOne({ "google.id": profile.id });
            if (existingUser) {
                return done(null, existingUser);
            }

            // Check if we have someone with the same email
            existingUser = await User.findOne({ "local.email": profile.emails[0].value })
            if (existingUser) {
                // We want to merge google's data with local auth
                existingUser.methods.push('google')
                existingUser.google = {
                    id: profile.id,
                    email: profile.emails[0].value
                }
                await existingUser.save()
                return done(null, existingUser);
            }

            const newUser = new User({
                methods: ['google'],
                google: {
                    id: profile.id,
                    email: profile.emails[0].value
                }
            });

            await newUser.save();
            done(null, newUser);
        }
    } catch (error) {
        done(error, false, error.message);
    }
}));