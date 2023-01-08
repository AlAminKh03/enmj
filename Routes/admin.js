
const express= require('express');
const Router = express.Router()
const isAuth = require('../middleware/is-auth')

const adminController= require('../contollers/admin')

// these 2 routes now explicitly set to /admin/add-products =>GET
Router.get('/add-product',isAuth,adminController.getAddProduct)
Router.get('/products',isAuth,adminController.getProducts)
Router.get('/edit-product/:productId',isAuth, adminController.getEditProduct)

// /admin/add-products =>POST 
Router.post('/add-product',isAuth,adminController.postAddProduct)
Router.post('/edit-product',isAuth,adminController.postEditProduct)
Router.post('/delete-product',isAuth,adminController.postDeleteProduct)

module.exports=Router;
