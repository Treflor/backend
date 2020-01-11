const Guide = require('../models/guide');

module.exports = {
    getGuide: async (req, res, next) => {
        if (req && req.params && req.params.guideId) {
            return Guide.findOne({ _id: req.params.guideId })
                .exec().then(guide => {
                    if (!guide)
                        return res.status(404).json({ error: 'Guide not found' });

                    return res.status(200).json(guide);
                });
        } else {
            return res.status(400).json({ error: 'Guide id not found' });
        }
    },
    getAllGuides: async (req, res, next) => {
        return Guide.find().limit(req.query.limit).skip(req.skip).lean().exec().then(guides => {
            return res.status(200).json(guides);
        });
    },

    createGuide: async (req, res, next) => {
        return new Guide(req.body).save()
            .then(guide => {
                return res.json({ success: true, id: guide.id });
            })
            .catch(e => {
                return res.json({ error: e, success: false })
            })
    },
}