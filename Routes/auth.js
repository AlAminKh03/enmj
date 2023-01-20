const express= require('express');
const User= require('../models/user')
const {check, body}= require('express-validator')
const Router = express.Router()
const authController = require('../contollers/auth')

Router.get('/login', authController.getAuth)
Router.post('/login',
[
    check('email')
    .isEmail()
    .withMessage('invalid user')
    .normalizeEmail(),
    body('password', 'Please insert correct password') 
    .isLength({min:6})
    .isAlphanumeric()
    .trim()
],
authController.postAuth)
Router.get('/signup', authController.getSignup);
Router.get('/reset', authController.getResetPass);
Router.post('/reset', authController.postResetPass);
Router.post('/signup', 
[check('email')
.isEmail()
.withMessage('email is invalid')
.custom((value,{req})=>{
    return User.findOne({ email: value })
      .then(userDoc => {
        if (userDoc) {
         return Promise.reject('E-Mail exists already, please pick a different one.')
        }})}),
    body('password','please insert only text or numbers at leaset 6 character')
    .isLength({min:6})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value,{req})=>{
    if (value !== req.body.password){
        throw new Error ('password have to match')
    }
    else{
        return true
    }
})]
, authController.postSignup);
Router.post('/logout', authController.postLogout)
Router.get('/reset/:token', authController.getNewPassword)
Router.post('/new-password', authController.postNewPassword)

module.exports= Router;