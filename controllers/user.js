const User = require('../models/user');

module.exports = {
    currentUser: async (req, res, next) => {
        res.status(200).json(req.user);
    },

    allUsers: async (req, res, next) => {
        if (req.user.privilege < 20) {
            return res.status(403).json({ success: false, err: "you don't have permissions" })
        }
        return User.find().lean().exec().then(users => res.send(users));
    },

    editUser: async (req, res, next) => {
        User.findByIdAndUpdate(req.user.id, req.user, { upsert: true }).exec()
            .then((result) => {
                res.send({ success: true });
            })
            .catch((e) => {
                res.send(e);
            });
    },

    unauthorizedUsers: async (req, res, next) => {
        if (req.user.privilege < 20) {
            return res.status(403).json({ success: false, err: "you don't have permissions" })
        }
        return User.find({ privilege: 0 }).lean().exec().then(users => res.send(users));
    },

    authorizedUsers: async (req, res, next) => {
        return User.find({ privilege: { $ne: 0 } }).lean().exec().then(users => res.send(users));
    },

    authorizeUser: async (req, res, next) => {
        if (req && req.params && req.params.userId) {
            if (req.user.privilege < 20) {
                return res.status(403).json({ success: false, err: "you don't have permissions" })
            }
            return User.findOne({ _id: req.params.userId }).exec().then(user => {
                if (!user) {
                    return res.status(404).json({ success: false, err: "user not found" })
                }
                if (user.privilege > 0) {
                    return res.status(400).json({ err: "aleady authorized" })
                }
                user.privilege = 10;
                return user.save().then(() => {
                    return res.status(200).json({ success: true });
                })
            });
        } else {
            return res.status(400).json({ error: 'User id not found' });
        }
    }
}