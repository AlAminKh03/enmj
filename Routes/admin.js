
const express= require('express');
const Router = express.Router()

const adminController= require('../contollers/admin')

// these 2 routes now explicitly set to /admin/add-products =>GET
Router.get('/add-product',adminController.getAddProduct)
Router.get('/products',adminController.getProducts)
// Router.get('/edit-product/:productId', adminController.getEditProduct)

// /admin/add-products =>POST 
Router.post('/add-product',adminController.postAddProduct)
Router.post('/edit-product',adminController.postEditProduct)
Router.post('/delete-product',adminController.postDeleteProduct)

module.exports=Router;
