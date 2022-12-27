// core built in module 
const path = require('path')
const adminRoutes=require('./admin')


const express = require('express');
const Router = express.Router();

const shopController= require("../contollers/shop")

Router.get('/',shopController.shopIndex)
Router.get('/product-list',shopController.shopProductList)
Router.get('/cart',shopController.shopCart)
Router.get('/order',shopController.shopOrder)
Router.get('/product/:productId',shopController.getProduct)
Router.get('/product-detils',shopController.shopProductDetails)
module.exports=Router;