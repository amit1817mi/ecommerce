const { errorHandler } = require('../helpers/dbErrorHandler');
const {Order} = require('../models/order'); // const Order = require('../models/order) --> giving error Order.find() is not a function so have to destructure order --> const {Order} = require('../models/order'); like this
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

exports.read = (req,res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req,res) => {
    User.findOneAndUpdate({_id: req.profile._id}, {$set: req.body}, {new: true}, (err,user) => {  // new: true --> it will send the updated data to client side
        if(err) {
            return res.status(400).json({
                error: 'You are not authorized to perform this action'
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    })
}

exports.addOrderToUserHistory = (req,res,next) => {
    let history = [];
    req.body.order.products.forEach((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    User.findOneAndUpdate({_id: req.profile._id}, {$push: {history: history}}, {new: true}, (error, data) => {
        if(error) {
            return res.status(400).json({
                error: 'Could not update user purchase history'
            });
        }
        next();
    })
}

exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort('-created')
    .exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(orders);
    })

}