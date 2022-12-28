const productModel =require("../models/product")

exports.shopIndex=(req,res,next)=>{
    productModel.fetchData(product=>{
        res.render("shop/index",{
            prods:product,
            path:'/', 
            title: "shop"
        })
    })
}
exports.shopProductList=(req,res,next)=>{
    productModel.fetchData(product=>{
        res.render("shop/product-list",{
            prods:product,
            path:'/product-list', 
            title: "product-list"
        })
    })
}

exports.shopCart=(req,res,next)=>{
    res.render('shop/cart',{
       path:'/cart',
       title:'Cart' 
    })
}
exports.shopProductDetails=(req,res,next)=>{
    res.render('shop/product-details',{
       path:'/product-details',
       title:'Cart' 
    })
}
exports.getProduct=(req,res,next)=>{
   const prodId= req.params.productId;
 productModel.findById(prodId,product=>{
    res.render('shop/product-details',{
        product:product,
        title:product.title,
        path:'/products'
    })
 })
   
}
exports.shopOrder=(req,res,next)=>{
    res.render('shop/order',{
       path:'/order',
       title:'Order' 
    })
}