const User = require('../models/user');

module.exports = {
    currentUser: async (req, res, next) => {
        res.status(200).json(req.user);
    },

    allUsers: async (req, res, next) => {
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
}