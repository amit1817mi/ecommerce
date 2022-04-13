const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    // console.log(id);
    // console.log('Hi');
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            // console.log(user);
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next();
    });
};