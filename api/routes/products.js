 const express = require('express');
 const router = express.Router();
 const mongoose = require('mongoose');
 
 const multer = require('multer');
const checkAuth = require('../models/check-auth');
 const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
 });
const fileFilter = (req,file,cb) => {
  if (file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png' ){
    cb(null, true);
  }else{
    cb(null,false);
  }
}
 const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5
  },

});
const Product = require('../models/product');
 

 router.get('/', (req, res, next) => {
  Product.find().select('name price _id ')
  .exec()
  .then(docs => {
    const response = {
    count: docs.length,
    products: docs.map(doc => {
      return {
        foodname: doc.foodname,
        price: doc.price,
        _id: doc._id,
        productImage: doc.productImage,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + doc._id
        }
      }
    })

    };
    res.status(200).json(response);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  })
 });
 router.post('/',upload.single('productImage') ,checkAuth, (req, res, next) => {
    console.log(req.file);
 
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      foodname: req.body.foodname,
      price: req.body.price,
      productImage: req.file.path 
    });
    product
    .save()
    .then(result =>  {
      res.status(200).json({
        createProduct: {          
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id,
          }
        }
        })
        
       })
    .catch(err => {
      console.log(err);
      res.status(501).json({
        error: err
      });
    });
  });

  router.get('/:productId',checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log("From Database",doc);
      if (doc){
        res.status(200).json({
          products: doc,
          request: {
            type: 'GET',
            description: 'Use the link to Get your selected product',
            url: 'http://localhost:3000/products/' + doc._id,
          }}
        );
      }else{
        res.status(404).json({
          message: 'No Valid entry found for provided ID'
        });
      }
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });

    });
  })
 
  router.patch('/:productId',checkAuth,(req, res, next) => {
    const id = req.params.productId; 
    const updateOps = {};
    for(const ops of req.body){
      updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id : id}, {$set: updateOps})
    .exec()
    .then(result => {
  
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id,
        }

      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  });
  router.delete('/:productId', checkAuth,(req, res, next) => {
    const id = req.params.productId;

    Product.remove({_id : id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number'
          }

        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });
  module.exports = router;
