const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://davidfoodapistore:' + process.env.MONGO_ATLAS_PW +'@foodstore.jjch9.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: true 
});
mongoose.Promise = global.Promise;


const app = express();
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 


app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE');
        return res.status(200).json();
    }
    next();
});
// Routes  which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/users',userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;