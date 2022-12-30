const productModel =require("../models/product")

exports.getAddProduct= (req,res,next)=>{
    res.render('admin/edit-product',{
        path:"/admin/add-product",
        title: "add-product", 
        editMode:false
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

exports.getEditProduct= (req,res,next)=>{
    const editMode=req.query.edit;
    if(!editMode){
        return res.redirect('/')
    }
    const prodId= req.params.productId;
    productModel.findById(prodId, product=>{
    if(!product){
        return res.redirect('/')
    }
    res.render('admin/edit-product',{
        product:product,
        path:"/admin/edit-product",
        title: "add-product",
        editMode:editMode
        })
    })  
}
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImgUrl = req.body.ImgUrl;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.description;

    const updatedProduct= new productModel(prodId,updatedTitle,updatedImgUrl,updatedPrice,updatedDesc)
    updatedProduct.save();
    res.redirect('/admin/products')

}

exports.postDeleteProduct=(req,res,next)=>{
const prodId= req.body.productId
productModel.deleteData(prodId)
res.redirect('/admin/products')
}

exports.postAddProduct=(req,res,next)=>{
    const title= req.body.title;    
    const ImgUrl=req.body.ImgUrl;    
    const price=req.body.price;    
    const description=req.body.description;    

    const product = new productModel(null,title,ImgUrl,price,description)
    product.save()
        res.redirect('/')
    }