const JWT = require('jsonwebtoken');
var mimeTypes = require('mimetypes');
const config = require('../configuration');
const User = require('../models/user');
const gcs = require('../helpers/cloud-storage');

signToken = (user, method) => {
    return JWT.sign({
        id: user.id,
        method: method,
    }, config.JWT_SECRET);
}

uploadProfile = (base64Image, email) => {
    var char = base64Image.charAt(0);
    var mimeType = '';
    switch (char) {
        case '/':
            mimeType = "image/jpeg";
            break;
        case 'i':
            mimeType = "image/png";
            break;
    }
    var fileName = email + '-original.' + mimeTypes.detectExtension(mimeType);
    var imageBuffer = Buffer.from(base64Image, 'base64');

    // Instantiate the GCP Storage instance
    bucket = gcs.bucket('treflor');

    // Upload the image to the bucket
    var file = bucket.file('profile-images/' + fileName);

    file.save(imageBuffer, {
        metadata: { contentType: mimeType },
        public: true,
        validation: 'md5'
    }, function (error) {

        if (error) {
            return console.log('Unable to upload the image.');
        }

        return console.log('Uploaded');
    });
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
            var realFile = Buffer.from(req.body.photo, "base64");
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

        uploadProfile(user.photo, user.email);
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