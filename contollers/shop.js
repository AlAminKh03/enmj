const productModel =require("../models/product")
const cartModel=require("../models/cart")

exports.shopIndex=(req,res,next)=>{
    productModel.fetchData()
    .then(products=>{
            res.render("shop/index",{
                prods:products,
                path:'/', 
                title: "shop"
            })
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.shopProductList=(req,res,next)=>{
    productModel.fetchData()
    .then(products=>{
        res.render("shop/product-list",{
            prods:products,
            path:'/product-list', 
            title: "product-list"
        })
})
.catch(err=>{
    console.log(err);
})
}

exports.shopCart=(req,res,next)=>{
    cartModel.getCartData(cartData=>{
        productModel.fetchData(products=>{
            const matchedData=[];
            for (const product of products){
                const cart= cartData.products.find(cart=> cart.id === product.id)
                if(cart){
                    matchedData.push({product, qty:cart.qty})
                }
            }
            res.render('shop/cart',{
                path:'/cart',
                title:'Cart' ,
                products:matchedData
             })
        })
     
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
   console.log(prodId);
 productModel.findById(prodId)
 .then(product=>{
    res.render('shop/product-details',{
        product:product,
        title:product.title,
        path:'/products'
    })
 })
}
exports.postProduct=(req,res,next)=>{
    const prodId= req.body.productId;
    productModel.findById(prodId,product=>{
    cartModel.addProduct(prodId,product.price)
    })
    res.redirect('/cart')
}

exports.deleteCartProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    productModel.findById(prodId, product=>{
        cartModel.deleteCartItem(prodId, product.price)
        res.redirect('/cart')
    })

}
exports.shopOrder=(req,res,next)=>{
    res.render('shop/order',{
       path:'/order',
       title:'Order' 
    })
}