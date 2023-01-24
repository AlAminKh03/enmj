const mongodb = require('mongodb')
const mongoose = require('mongoose')
const {validationResult}= require('express-validator')
const objectid=mongodb.ObjectId
const productModel =require("../models/product")

exports.getAddProduct= (req,res,next)=>{
    res.render('admin/edit-product',{
        path:"/admin/add-product",
        title: "add-product", 
        editMode:false,
        hasError: false,
        errMessage:null,
        oldInput:{
         title:'',
         ImgUrl:'',
         price:'',
         description:''
        }
        })
}
exports.postAddProduct=(req,res,next)=>{
    const title= req.body.title;    
    const img=req.file;    
    const price=req.body.price;    
    const description=req.body.description; 
     
    const errors= validationResult(req)
 
    console.log(img);
    if(!img){
        return res.status(422).render('admin/edit-product',{
            path:"/admin/add-product",
            title: "add-product", 
            editMode:false,
           hasError: true,
           errMessage:" Invalid Img extension",
           product:{
            title:title,
            price:price,
            description:description
           }
            })
    }

if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product',{
        path:"/admin/add-product",
        title: "add-product", 
        editMode:false,
       hasError: true,
       errMessage:errors.array()[0].msg,
       product:{
        title:title,
        price:price,
        description:description
       }
        })
}
const ImgUrl= img.path
    const product = new productModel({
        title,
        ImgUrl,
        price, 
        description ,
        userId: req.session.user})
    product.save()
    .then(result=>{
        // console.log('created product');
        res.redirect('/')
    })
    .catch(err=>{
        const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
})
        
    }
exports.getProducts= (req,res,next)=>{
    productModel.find({userId:req.user._id})
    .then(products=>{
        if(!products){
            return res.redirect('/')
        }
        return res.render("admin/products",{
                prods:products,
                path:'/admin/products', 
                title: "products",
                isAuthenticated: req.session.isLoggedIn
            }
    )})
    .catch(err=>{
        const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
    })

}

exports.getEditProduct= (req,res,next)=>{
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/')
    }
    const prodId= req.params.productId;
    productModel.findById(prodId)
    .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/')
        } 
        res.render('admin/edit-product',{
        product:product,
        path:"/admin/edit-product",
        title: "edit-product",
        editMode:editMode,
        isAuthenticated: req.session.isLoggedIn,
        hasError:false,
        errMessage:null
        })
    })
}
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImg = req.file;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    const errors= validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('admin/edit-product',{
            path:"/admin/edit-product",
            title: "edit-product", 
            editMode:true,
           hasError: true,
           errMessage:errors.array()[0].msg,
           product:{
            title:updatedTitle,
            price:updatedPrice,
            description:updatedDesc,
            _id:prodId
           }
            })
    }
    
    productModel.findById(prodId)
    .then(product=>{
        product.title= updatedTitle
        if(updatedImg){
            product.ImgUrl= updatedImg.path
        }
        product.price= updatedPrice
        product.description = updatedDesc
        return product.save()
        .then(result=>{
            res.redirect('/admin/products')
        })
    })
    .catch(err=>{
        const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
    })
}

exports.postDeleteProduct=(req,res,next)=>{
const prodId= req.body.productId
productModel.deleteOne({_id:prodId, userId:req.user._id})
.then(()=>{
    res.redirect('/admin/products')
})
.catch(err=>{
    const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
})
}

