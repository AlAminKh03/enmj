const productModel =require("../models/product")

exports.getAddProduct= (req,res,next)=>{
    res.render('admin/add-product',{
        path:"/admin/add-product",
        title: "add-product"
        })
}
exports.getProducts= (req,res,next)=>{
    productModel.fetchData(product=>{
        res.render("admin/products",{
            prods:product,
            path:'/admin/products', 
            title: "products"
        })
    })
}

exports.postAddProduct=(req,res,next)=>{
    const title= req.body.title;    
    const ImgUrl=req.body.ImgUrl;    
    const price=req.body.price;    
    const description=req.body.description;    

    const product = new productModel(title,ImgUrl,price,description)
    product.save()
        res.redirect('/')
    }