var mimeTypes = require('mimetypes');
const config = require('../configuration');
const Gallery = require('../models/gallery');
const storage = require('../services/cloud-storage');
const shortId = require('shortid');

storeImage = async (photo, filename, cb) => {
    storage.storeFile(Buffer.from(photo, "base64"), 'gallery', filename, cb);
}

module.exports = {
    insertImages: async (req, res) => {
        var data = req.body;
        var gallery = new Gallery({ title: data.title, user: req.user.id });
        gallery.save();

        if (data.img0 != null) {
            storeImage(data.img0, shortId(), (err, url) => {
                gallery.img0 = url;
                gallery.save();
            });
        }
        if (data.img1 != null) {
            storeImage(data.img1, shortId(), (err, url) => {
                gallery.img1 = url;
                gallery.save();
            });
        }
        if (data.img2 != null) {
            storeImage(data.img2, shortId(), (err, url) => {
                gallery.img2 = url;
                gallery.save();
            });
        }
        if (data.img3 != null) {
            storeImage(data.img3, shortId(), (err, url) => {
                gallery.img3 = url;
                gallery.save();
            });
        }
        if (data.img4 != null) {
            storeImage(data.img4, shortId(), (err, url) => {
                gallery.img4 = url;
                gallery.save();
            });
        }

        res.json({ status: "success", id: gallery.id });
    },

    getGallery: async (req, res) => {
        if (req && req.params && req.params.galleryId) {
            return Gallery.findOne({ _id: req.params.galleryId,delete:false })
                .populate('user')
                .exec().then(gallery => {
                    if (!gallery)
                        return res.status(404).json({ error: 'gallery not found' });

                    return res.status(200).json(gallery);
                });
        } else {
            return res.status(400).json({ error: 'gallery id not found' });
        }
    },

    getAllImages: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        return Gallery.find({delete:false}).limit(req.query.limit).skip(req.skip).lean().exec().then(gallery => {
            return res.status(200).json(gallery);
        });
    },


    getAllPublishedImages: async (req, res, next) => {
        return Gallery.find({ published: true,delete:false }).limit(req.query.limit).skip(req.skip).lean().populate('user').exec().then(gallery => {
            return res.status(200).json(gallery);
        });
    },

    getAllUnpublishedImages: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        return Gallery.find({ published: false,delete:false }).limit(req.query.limit).skip(req.skip).lean().exec().then(gallery => {
            return res.status(200).json(gallery);
        });
    },

    publishImages: async (req, res, next) => {
        if (req.user.privilege < 20) {
            console.log("Unathorized reqeust: " + req.user.email);
            return res.status(403).json({ status: false, err: 'you don\'t have permission to view' })
        }
        if (req && req.params && req.params.galleryId) {
            return Gallery.findOne({ _id: req.params.galleryId,delete:false })
                .exec().then(gallery => {
                    if (!gallery)
                        return res.status(404).json({ error: 'gallery not found' });

                    gallery.published = true;
                    gallery.save().then(() => {
                        return res.status(200).json(gallery);
                    });
                });
        } else {
            return res.status(400).json({ error: 'gallery id not found' });
        }
    },

    deleteGallery: async (req, res, next) => {
        if (req && req.params && req.params.galleryId) {
            Gallery.findOne({ _id: req.params.galleryId }).exec().then(gallery => {
                if (!gallery)
                    return res.status(400).json({ error: "gallery not found!" });
                if (gallery.user != req.user.id || req.user.privilege < 20) {
                    return req.status(403).json({ err: "you are not allowed to delete!" })
                }
                gallery.delete = true;
                gallery.save().then(() => {
                    return res.status(200).json({ success: true });
                })
            });
        } else {
            return res.status(400).json({ error: 'gallery id not found' });
        }
    },
}