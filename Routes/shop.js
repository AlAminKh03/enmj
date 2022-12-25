// core built in module 
const path = require('path')
const adminRoutes=require('./admin')


const express = require('express');
const Router = express.Router();

const productController= require("../contollers/products")

Router.get('/',productController.shopProduct)
module.exports=Router;