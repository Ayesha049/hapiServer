'use strict'

require('dotenv').config()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.plugin = {
    register: (server, optons, next) => {
        server.route({
            method: 'POST',
            path: '/register',
            handler: (req, h) => {
                const userData = {
                    first_name: req.payload.first_name,
                    last_name: req.payload.last_name,
                    user_email: req.payload.user_email,
                    user_password: req.payload.user_password
                }

                return User.findOne({
                        user_email: req.payload.user_email
                    })
                    .then(user => {
                        if (!user) {
                            bcrypt.hash(req.payload.user_password, 10, (err, hash) => {
                                userData.user_password = hash;
                                return User.create(userData)
                                    .then(user => {
                                        return { status: user.use_email = ' registered!' }
                                    })
                                    .catch(err => {
                                        return 'error' + err
                                    })
                            })
                            return { status: userData.use_email = ' registered!' }
                        } else {
                            return { error: 'user already exists' }
                        }

                    })
                    .catch(err => {
                        return 'error: ' + error;
                    })
            }
        })

        server.route({
            method : 'POST',
            path : '/login',
            handler : (req, h) => {
                return User.findOne({
                    user_email : req.payload.user_email
                })
                .then(user => {
                    if(user){
                        if(bcrypt.compareSync(req.payload.user_password,user.user_password))
                        {
                            const payload = {
                                id : user._id,
                                first_name : user.first_name,
                                last_name : user.last_name,
                                email : user.user_email
                            }
                            
                            let token = jwt.sign(payload,process.env.SECRET_KEY, {
                                expiresIn : 1440
                            });
                            //console.log(`token : ${token}`)
                            return token;
                        }
                        else{
                            return {error : 'incorrect password!'}
                        }
                    }
                    else{
                        return {error : 'user not found!'}
                    }
                })
                .catch(err => {
                    return {error : err}
                })
            }
        })

        server.route({
            method : 'GET',
            path : '/profile',
            handler : (req, h) => {
                //console.log('endpoint hit')
                //console.log(req.headers['authorization'])
                var token = req.headers['authorization'].replace('Bearer ', '');
                var decoded = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        console.log('jwt error ' + err + '  end')
                     return err;
                    }
                  
                    return decoded
                   })
                   

                //console.log(decoded.id)

                return User.findOne({
                    _id : mongoose.Types.ObjectId(decoded.id)
                })
                .then(user => {
                    if(user) {
                        return user;
                    }
                    else{
                        return { Error : 'User not found!'}
                    }
                })
                .catch(err => {
                    return { error : err}
                })
            }
        })

    },
    name: 'users'
}