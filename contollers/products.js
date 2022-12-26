const productModel =require("../models/product")

exports.getAddProduct= (req,res,next)=>{
    res.render('add-product',{
        path:"/admin/add-product",
        title: "add-product"
        })
}

exports.postAddProduct=(req,res,next)=>{
    const product = new productModel(req.body.title)
    product.save()
        res.redirect('/')
    }

exports.shopProduct=(req,res,next)=>{
    productModel.fetchData(product=>{
        res.render("shop",{
            prods:product,
            path:'/', 
            title: "shop"
        })
    })
    
}
