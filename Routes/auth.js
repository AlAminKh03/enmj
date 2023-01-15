const express= require('express');
const Router = express.Router()
const authController = require('../contollers/auth')

Router.get('/login', authController.getAuth)
Router.post('/login', authController.postAuth)
Router.get('/signup', authController.getSignup);
Router.get('/reset', authController.getResetPass);
Router.post('/reset', authController.postResetPass);
Router.post('/signup', authController.postSignup);
Router.post('/logout', authController.postLogout)
Router.get('/reset/:token', authController.getNewPassword)
Router.post('/new-password', authController.postNewPassword)

module.exports= Router;