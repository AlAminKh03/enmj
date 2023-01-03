const productModel =require("../models/product")
const cartModel=require("../models/cart")
const UserModel = require("../models/user")
const mongodb= require("mongodb")

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

exports.shopCart = (req, res, next) => {
    req.user.getCart()
    .then(products=>{
        res.render('shop/cart', {
            path: '/cart',
            title: 'Cart',
            products: products
          })
    })
    //   .then(cartData => {
    //     // console.log("logging from shopCart", cartData.cart.items);
    //    return productModel.fetchData()
    //       .then(products => {
    //         const matchedData = [];
    //         for (const product of products) {
    //             // console.log(product);
    //           const cart = cartData.cart.items.find(userCart => {
    //             return userCart._id.toString().split(' ')[0] ===  product._id.toString().split(' ')[0]
    //         })
    //           const cartIndex = cartData.cart.items.findIndex(userCart =>userCart._id.toString().split(' ')[0] === product._id.toString().split(' ')[0])
    //           console.log("logging from loop", cart, cartIndex);
    //           if (cart) {
    //             matchedData.push({ product, qty: cart.quantity })
    //           }
    //           else{
    //           }
    //         }
    //         // console.log(matchedData);
    //         res.render('shop/cart', {
    //           path: '/cart',
    //           title: 'Cart',
    //           products: matchedData
    //         })
    //       })
    //   }) // missing parenthesis here
  }
exports.shopProductDetails=(req,res,next)=>{
    res.render('shop/product-details',{
       path:'/product-details',
       title:'Cart' 
    })
}
exports.getProduct=(req,res,next)=>{
   const prodId= req.params.productId;
//    console.log(prodId);
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
    productModel.findById(prodId)
   .then(product=>{
    return req.user.addToCart(product) 
   })
   .then(result=>{
    // console.log("consolling from post product", result);
    res.redirect('/cart')
   })
    
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