const mongodb = require('mongodb')
const objectid=mongodb.ObjectId
const productModel =require("../models/product")

exports.getAddProduct= (req,res,next)=>{
    res.render('admin/edit-product',{
        path:"/admin/add-product",
        title: "add-product", 
        editMode:false,
        isAuthenticated: req.isLoggedIn
        })
}
exports.postAddProduct=(req,res,next)=>{
    const title= req.body.title;    
    const ImgUrl=req.body.ImgUrl;    
    const price=req.body.price;    
    const description=req.body.description;    

    const product = new productModel({title,ImgUrl,price, description , userId: req.session.user})
    product.save()
    .then(result=>{
        // console.log('created product');
        res.redirect('/')
    })
    .catch(err=>{
        console.log(err);
    })
        
    }
exports.getProducts= (req,res,next)=>{
    productModel.find()
    .then(products=>{
            res.render("admin/products",{
                prods:products,
                path:'/admin/products', 
                title: "products",
                isAuthenticated: req.isLoggedIn
            }
    )})
    .catch(err=>{
        console.log(err);
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
        if(!product){
            return res.redirect('/')
        } 
        res.render('admin/edit-product',{
        product:product,
        path:"/admin/edit-product",
        title: "add-product",
        editMode:editMode,
        isAuthenticated: req.isLoggedIn
        })
    })
}
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.ImgUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    productModel.findById(prodId).then(product=>{
        product.title= updatedTitle
        product.ImgUrl= updatedImgUrl
        product.price= updatedPrice
        product.description = updatedDesc
        product.save()
    })
    .then(result=>{
        res.redirect('/admin/products')
    })
    

}

exports.postDeleteProduct=(req,res,next)=>{
const prodId= req.body.productId
productModel.findByIdAndDelete(prodId)
.then(()=>{
    res.redirect('/admin/products')
})
.catch(err=>{
    console.log(err);
})
}

