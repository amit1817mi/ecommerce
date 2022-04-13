const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req,res,next,id) => {
    Product.findById(id).exec((err,product) => {
        if(err || !product){
            return res.status(400).json({
                error: "Product not found"
            });
        }
        req.product = product;
        next();
    });
};

exports.read = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        console.log(fields);

        // check for all fields 
        const { name, description, price, category, quantity, shipping } = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = new Product(fields);

        // 1kb = 1000
        // 1mb = 1000000
        // console.log(files);
        // console.log(files.photo);
        // console.log(files.photo.filepath);
        // console.log(files.photo.mimetype);
        if (files.photo) {
            // console.log("Files Photo",files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1 mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })

    })
}

exports.remove = (req,res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            "message": "Product deleted successfully"
        })
    })
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        console.log(fields);

        // check for all fields 
        const { name, description, price, category, quantity, shipping } = fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);  // .extend provided by lodash

        // 1kb = 1000
        // 1mb = 1000000
        // console.log(files);
        // console.log(files.photo);
        // console.log(files.photo.filepath);
        // console.log(files.photo.mimetype);
        if (files.photo) {
            // console.log("Files Photo",files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1 mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(result);
        })

    })
}