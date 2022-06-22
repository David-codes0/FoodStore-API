const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            res.status(409).json({
                message: 'Mail doesn\'t exist'
            })
        }else{
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err 
                })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    }); 
                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json(result);
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                        });
                    })
                }
            });
        }
    });   
});
router.get('/:userId', (req, res, next) => {
    User.findById(req.params.userId)
    .exec()
    .then(user => {
      if(!user){
        return  res.status(404).json({
          message: 'User not found'
        }); 
      }
      else{
      res.status(200).json(user);}
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

  router.post('/login', (req , res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Auth failed' 
            })
        }
        bcrypt.compare(req.body.password,user[0].password, (err,result) => {
            if (err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                }

                );
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        })
    })
    .catch(err => {
        res.status(500).json({
          error: err
        })
    });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userid})
    .exec()
    .then(user => {
        user.status(200).json({
            message: 'User delete'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;

