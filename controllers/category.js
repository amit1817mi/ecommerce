const Category = require('../models/category');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req,res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({data}); // {data: data} instead of this we can write only data because both are same
    })
}