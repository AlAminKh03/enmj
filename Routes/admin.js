
const express= require('express');
const Router = express.Router()

const productController= require('../contollers/products')

// these 2 routes now explicitly set to /admin/add-products =>GET
Router.get('/add-product',productController.getAddProduct)

// /admin/add-products =>POST 
Router.post('/add-product',productController.postAddProduct)

module.exports=Router;
