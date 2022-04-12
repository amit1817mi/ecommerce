const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator =  require('express-validator');
require('dotenv').config();  // This will allow us to use env varibles in .env file

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// app
const app = express(); // Now express is in the app variable

// db
mongoose.connect(process.env.DATABASE)
.then(() => console.log("DB Connected"));

// middlewares
app.use(morgan('dev'));  // dev --> flag
app.use(bodyParser.json());  // .json --> so that we can get json data from request.body
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);

const port = process.env.PORT || 8000;  // Just like in browser we get document object...in nodejs environment we have process

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});