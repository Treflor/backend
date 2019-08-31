module.exports = {
    currentUser: async (req, res, next) => {
        var user = req.user[req.user.method];
        res.status(200).json({ user });
    },
}