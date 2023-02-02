// // core built in module 
const path = require('path')
const adminRoutes=require('./admin')
const isAuth = require('../middleware/is-auth')

const express = require('express');
const Router = express.Router();

const shopController= require("../contollers/shop")

Router.get('/',shopController.shopIndex)
Router.get('/product-list',shopController.shopProductList)
Router.get('/cart',isAuth,shopController.shopCart)
Router.post('/cart',isAuth,shopController.postProduct)
Router.post('/delete-cart',isAuth,shopController.deleteCartProduct)

Router.get('/product/:productId',shopController.getProduct)
Router.get('/product-detils',shopController.shopProductDetails)
Router.get('/order',isAuth,shopController.shopOrder)
Router.get('/checkout',isAuth,shopController.getCheckOut)
Router.get('/checkout/success',shopController.postOrder)
Router.get('/checkout/cancel',shopController.getCheckOut)
Router.get('/order/:orderId',isAuth,shopController.getInvoice)

module.exports=Router;