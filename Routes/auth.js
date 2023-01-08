const express= require('express');
const Router = express.Router()
const authController = require('../contollers/auth')

Router.get('/login', authController.getAuth)
Router.post('/login', authController.postAuth)
Router.get('/signup', authController.getSignup);
Router.post('/signup', authController.postSignup);
Router.post('/logout', authController.postLogout)

module.exports= Router;