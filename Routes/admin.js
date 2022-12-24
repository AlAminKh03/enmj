const path=require('path')

const express= require('express');
const Router = express.Router()

const rootDir= require('../utils/path')

const product=[]

// these 2 routes now explicitly set to /admin/add-products =>GET
Router.get('/add-product',(req,res,next)=>{
    console.log('This is product route')
    res.render('add-product',{path:"/admin/add-product"})
})

// /admin/add-products =>POST 
Router.post('/add-product',(req,res,next)=>{
product.push({title:req.body.title })
    res.redirect('/')
})

exports.router=Router;
exports.product=product
