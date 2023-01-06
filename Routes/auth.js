const express= require('express');
const Router = express.Router()
const authController = require('../contollers/auth')

Router.get('/login', authController.getAuth)
Router.post('/login', authController.postAuth)

module.exports= Router;