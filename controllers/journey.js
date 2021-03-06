const Journey = require('../models/journey');
const User = require('../models/user');
const Landmark = require('../models/landmark');
const shortId = require('shortid');
const storage = require('../services/cloud-storage');

storeImage = async (photo, filename, cb) => {
    storage.storeFile(Buffer.from(photo, "base64"), "images", filename, cb);
}

module.exports = {
    insertJourney: async (req, res) => {
        var journey = req.body;
        journey.user = req.user.id;
        var journeyObj = new Journey(journey);
        journeyObj.journey.image = "";
        journeyObj.images = [];
        journeyObj.landmarks = [];
        var dbres = await journeyObj.save();
        if (dbres != null) {
            res.json({ success: true, id: journey.id });
        } else {
            console.log(e)
            res.status(400).json({ error: e, success: false });
        }

        if (journey.journey.image != null) {
            storeImage(journey.journey.image, shortId(), (err, url) => {
                journey.journey.image = url;
                Journey.findOneAndUpdate({ _id: journeyObj.id }, { $set: { journey: journey.journey } }).exec();
            });
        }

        if (journey.images != null) {
            journey.images.forEach((image) => {
                storeImage(image, shortId(), (err, url) => {
                    Journey.findOneAndUpdate({ _id: journeyObj.id }, { $push: { images: url } }).exec();
                });
            });
        }

        if (journey.landmarks != null) {
            journey.landmarks.forEach(async function (landmark) {
                var landmarkObj = new Landmark(landmark);
                journeyObj.landmarks = [];
                landmarkObj.user = req.user.id;
                landmarkObj.journey = journeyObj.id;
                landmarkObj.images = [];
                landmarkObj.save();

                journeyObj.landmarks.push(landmarkObj.id);
                journeyObj.save();

                if (landmark.images != null) {
                    landmark.images.forEach(function (image) {
                        storeImage(image, shortId(), (err, url) => {
                            Landmark.findOneAndUpdate({ _id: landmarkObj.id }, { $push: { images: url } }).exec();
                        });
                    });
                }

            });
        }
    },

    getJourney: async (req, res) => {
        if (req && req.params && req.params.journeyId) {
            return Journey.findOne({ _id: req.params.journeyId })
                .populate('user')
                .populate("landmarks")
                .exec().then(journey => {
                    if (!journey)
                        return res.status(404).json({ error: 'journey not found' });

                    return res.status(200).json(journey);
                });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },

    getAllJourney: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        return Journey.find().limit(req.query.limit).skip(req.skip).lean()
            .populate('user')
            .populate("landmarks")
            .exec().then(journeys => {
                return res.status(200).json(journeys);
            });
    },


    getAllPublishedJourney: async (req, res, next) => {
        return Journey.find({ published: true }).limit(req.query.limit).skip(req.skip).lean()
            .populate('user')
            .populate('landmarks')
            .exec().then(journey => {
                return res.status(200).json(journey);
            });
    },

    getAllUnpublishedJourney: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        return Journey.find({ published: false }).limit(req.query.limit).skip(req.skip).lean()
            .populate('user')
            .populate('landmarks')
            .exec().then(journey => {
                return res.status(200).json(journey);
            });
    },

    publishJourney: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        if (req && req.params && req.params.journeyId) {
            return Journey.findOne({ _id: req.params.journeyId })
                .exec().then(journey => {
                    if (!journey)
                        return res.status(404).json({ error: 'journey not found' });

                    journey.published = true;
                    journey.save().then(() => {
                        return res.status(200).json(journey);
                    });
                });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },

    deleteJourney: async (req, res, next) => {
        if (req && req.params && req.params.journeyId) {
            Journey.findOne({ _id: req.params.journeyId }).exec().then(journey => {
                if (!journey)
                    return res.status(400).json({ error: "journey not found!" });
                if (journey.id != req.user._id || req.user.privilege < 20) {
                    return req.status(403).json({ err: "you are not allowed to delete!" })
                }
                journey.delete().then(() => {
                    return res.status(200).json({ success: true });
                })
            });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },

    addFavoriteJourney: async (req, res, next) => {
        if (req && req.params && req.params.journeyId) {
            return Journey.findOne({ _id: req.params.journeyId })
                .exec().then(journey => {
                    if (!journey)
                        return res.status(404).json({ error: 'journey not found' });
                    if (journey.favorites.indexOf(req.user.id) === -1) journey.favorites.push(req.user.id);
                    journey.save().then(_ => {
                        res.status(200).json({ success: true, msg: "added to favorite" });
                    }).catch(_ => {
                        res.status(500).json({ success: false, msg: "fail on adding!" });
                    });

                    User.findOne({ _id: req.user.id }).exec().then(user => {
                        if (user) {
                            if (user.favorites.indexOf(req.params.journeyId) === -1) user.favorites.push(req.params.journeyId);
                            user.save()
                        }
                    })
                });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },

    removeFavoriteJourney: async (req, res, next) => {
        if (req && req.params && req.params.journeyId) {
            return Journey.findOne({ _id: req.params.journeyId })
                .exec().then(journey => {
                    if (!journey)
                        return res.status(404).json({ error: 'journey not found' });
                    if (journey.favorites.indexOf(req.user.id) !== -1)
                        journey.favorites = journey.favorites.filter(id => id !== req.user.id);
                    journey.save().then(_ => {
                        res.status(200).json({ success: true, msg: "removed from favorite" });
                    }).catch(_ => {
                        res.status(500).json({ success: false, msg: "fail on removing!" });
                    });

                    User.findOne({ _id: req.user.id }).exec().then(user => {
                        if (user) {
                            if (user.favorites.indexOf(req.params.journeyId) !== -1)
                                user.favorites = user.favorites.filter(id => id !== req.params.journeyId);
                            user.save()
                        }
                    })
                });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },
}