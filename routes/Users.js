'use strict'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');

process.env.SECRET_KEY = 'secret'

exports.plugin = {
    register: (server, optons, next) => {
        server.route({
            method: 'POST',
            path: '/register',
            handler: (req, h) => {
                const userData = {
                    first_name: req.payload.first_name,
                    last_name: req.payload.last_name,
                    user_email: req.payload.use_email,
                    user_password: req.payload.user_password
                }

                return User.findOne({
                        user_email: req.payload.use_email
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
    },
    name: 'users'
}