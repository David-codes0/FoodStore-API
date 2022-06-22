// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose'); // mongoose to create ID
//  const Order = require('../models/order');
// const Product = require('../models/product');
// const checkAuth = require('../middleware/check-auth');

//  router.get('/',checkAuth, (req, res, next) => {
//     Order.find().select('quantity _id product')
//     .populate('product')
//     .exec()
//     .then(docs => {
//       res.status(200).json({
//         count: docs.length,
//         order: docs.map(doc => {
//           return {
//             id: doc._id,
//             product: doc.product,
//             quantity: doc.quantity,
//             request: {
//               type: 'GET',
//               url: 'http://localhost:3000/orders/' + doc._id
//             }
//           }
//         })
//       });
//     })
//     .catch(
//       err => {
//         res.status(500).json({
//           error: err
//         });
//       }
//     );
  
//   });

//   router.post('/', checkAuth,(req, res, next) => {
//     Product.findById(req.body.productId)
//     .then(product => {
//       if (!product){
//         res.status(404).json({
//           message: 'Product Not Found'
//         })
//       }
//       const order = new Order ({
//         _id: mongoose.Types.ObjectId(),   
//         quantity: req.body.quantity,
//         product: req.body.productId,
//       });
//       return order.save();
//     })
//       // .exec()
//       .then(result => {
       
//         res.status(200).json({
//           message: 'Created Succcefully',
//            createdOrder: {
//               id: result._id,
//               product: result.product,
//               quantity: result.quantity,     
//             },
//             request: {
//               type: 'GET',
//               url: 'http://localhost:3000/orders/' + result._id
//             }
//         })
//       })
  
    
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
      
//     });
//   });

//   // Handles incoming GET requests to /orders
//   router.get('/:orderId',checkAuth, (req, res, next) => {
//     Order.findById(req.params.orderId)
//     .populate('product', 'name')
//     .exec()
    
//     .then(order => {
//       if(!order){
//         return  res.status(404).json({
//           message: 'Order not found'
//         }); 
//       }
//       res.status(200).json({
//           order: {
//             id: order._id,
//               product: order.product,
//               quantity: order.quantity, 
//           },
//           request: {
//             type: 'GET',
//             url: 'http://localhost:3000/orders'
//           }
//        });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       })
//     });
    
//   });

//   router.delete('/:orderId',checkAuth, (req, res, next) => {
//     Order.remove({_id : req.params.orderId})
//     .exec()
//     .then(result => {
//       res.status(200).json({
//         message: 'Orders deleted',
//         request: {
//           type: 'POST',
//           url: 'http://localhost:3000/order',
//           body: {
//             productId: 'ID',
//             quantity: 'Number'
//           }
//         }
//        });
//     }).catch(err => {
//       res.status(500).json({
//         error: err
//       })
//     });
   
//   });
//   module.exports = router;



  