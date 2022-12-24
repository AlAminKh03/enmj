// core built in module 
const path = require('path')
const adminRoutes=require('./admin')


const express = require('express');
const Router = express.Router();

const rootDir= require('../utils/path')

Router.get('/',(req,res,next)=>{
    const products=adminRoutes.product
    res.render("shop",{prods:products, path:'/'})
})
module.exports=Router;