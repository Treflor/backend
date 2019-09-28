const User = require('../models/user');

module.exports = {
    currentUser: async (req, res, next) => {
        var user = req.user[req.user.method];
        user.password = undefined;
        res.status(200).json({ user });
    },
    editUser: async (req, res, next) => {
        req.user[req.user.method].email = req.body.email;
        req.user[req.user.method].given_name = req.body.given_name;
        req.user[req.user.method].family_name = req.body.family_name;
        req.user[req.user.method].birthday = req.body.birthday;
        req.user[req.user.method].gender = req.body.gender;
        User.findByIdAndUpdate(req.user.id, req.user, { upsert: true }).exec()
            .then((result) => {
                res.send({ success: true });
            })
            .catch((e) => {
                res.send(e);
            });
    },
}