const product=[]

exports.getAddProduct= (req,res,next)=>{
    console.log('This is product route')
    res.render('add-product',{
        path:"/admin/add-product",
        title: "add-product"
        })
}

exports.postAddProduct=(req,res,next)=>{
    product.push({title:req.body.title })
        res.redirect('/')
    }

exports.shopProduct=(req,res,next)=>{
    res.render("shop",{
        prods:product, 
        path:'/', 
        title: "shop"
    })
}
