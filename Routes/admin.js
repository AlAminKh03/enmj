
const express= require('express');
const Router = express.Router()

const adminController= require('../contollers/admin')

// these 2 routes now explicitly set to /admin/add-products =>GET
Router.get('/add-product',adminController.getAddProduct)
Router.get('/products',adminController.getProducts)

// /admin/add-products =>POST 
Router.post('/add-product',adminController.postAddProduct)

module.exports=Router;
