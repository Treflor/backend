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
        return Journey.find().limit(req.query.limit).skip(req.skip).lean().populate('user').exec().then(journey => {
            return res.status(200).json(journey);
        });
    },

    deleteJourney: async (req, res, next) => {
        if (req && req.params && req.params.journeyId) {
            Journey.deleteOne({ _id: req.params.journeyId }).exec().then(journey => {
                if (!journey)
                    return res.status(400).json({ error: "journey not found!" });
                return res.status(200).json({ success: true });
            });
        } else {
            return res.status(400).json({ error: 'journey id not found' });
        }
    },
}