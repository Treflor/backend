const Guide = require('../models/guide');
const storage = require('../services/cloud-storage');
const shortid = require('shortid');

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
        var { guide, title, img, date } = req.body;
        var guideObj = new Guide({ guide: guide, title: title, img: "", date: date });

        storage.storeFile(Buffer.from(img, "base64"), 'guides', shortid.generate(), (err, url) => {
            if (err) {
                console.log("failed to upload guide photo");
                console.log(err);
            } else {
                console.log("guide photo uploded");
                guideObj.img = url;
                guideObj.save();
            }
        });
        guideObj.save()
            .then(guide => {
                return res.json({ success: true, id: guide.id });
            })
            .catch(e => {
                return res.json({ error: e, success: false })
            })
    },
}