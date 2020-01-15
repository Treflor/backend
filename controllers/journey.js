const Journey = require('../models/journey');

module.exports = {
    insertJourney: async (req, res) => {
        return new Journey(req.body).save()
            .then(journey => {
                return res.json({ success: true, id: journey.id });
            })
            .catch(e => {
                return res.json({ error: e, success: false });
            })
    },

    getJourney: async (req, res) => {
        if (req && req.params && req.params.journeyId) {
            return Journey.findOne({ _id: req.params.journeyId })
                .populate('user')
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
        return Journey.find().limit(req.query.limit).skip(req.skip).lean().populate('user').exec().then(journeys => {
            return res.status(200).json(journeys);
        });
    },


    getAllPublishedJourney: async (req, res, next) => {
        return Journey.find({ published: true }).limit(req.query.limit).skip(req.skip).lean().populate('user').exec().then(journey => {
            return res.status(200).json(journey);
        });
    },

    getAllUnpublishedJourney: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        return Journey.find({ published: false }).limit(req.query.limit).skip(req.skip).lean().populate('user').exec().then(journey => {
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
}