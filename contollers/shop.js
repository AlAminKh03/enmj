const productModel =require("../models/product")
const cartModel=require("../models/cart")
const UserModel = require("../models/user")
const mongodb= require("mongodb")
const OrderModel = require("../models/order")
const fs= require('fs')
const path= require('path')


exports.shopIndex=(req,res,next)=>{
    productModel.find()
    .then(products=>{
            res.render("shop/index",{
                prods:products,
                path:'/', 
                title: "shop",
                isAuthenticated: req.session.isLoggedIn
            })
    })
    .catch(err=>{
        const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
    })
}
exports.shopProductList=(req,res,next)=>{
    productModel.find()
    .then(products=>{
        res.render("shop/product-list",{
            prods:products,
            path:'/product-list', 
            title: "product-list",
            isAuthenticated: req.session.isLoggedIn
        })
})
.catch(err=>{
    const error= new Error(err);
    error.httpStatusCode =500;
    return next(error)
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
//    console.log(prodId);
 productModel.findById(prodId)
 .then(product=>{
    res.render('shop/product-details',{
        product:product,
        title:product.title,
        path:'/products',
        isAuthenticated: req.session.isLoggedIn
    })
 })
}
exports.shopCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
    .then(products=>{
        const Cartproducts= products.cart.items
        res.render('shop/cart', {
            path: '/cart',
            title: 'Cart',
            products: Cartproducts,
            isAuthenticated: req.session.isLoggedIn
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
    req.user.deleteCartItem(prodId)
    .then(result=>{
        res.redirect('/cart')
    })

}
exports.postOrder=(req,res,next)=>{
    req.user.populate('cart.items.productId')
    .then(user=>{
      const productData = user.cart.items.map(p=>{
        return { product: {...p.productId._doc}, quantity: p.quantity}
      })
      console.log(productData);
      const order = new OrderModel({
        products: productData,
        users:{
            email: req.user.email,
            userId: req.user
        }
      })
      return order.save()
    })
    .then(result=>{
        req.user.clearCartItems()
        res.redirect('/order')
    })
    .catch(err=>{
        const error= new Error(err);
        error.httpStatusCode =500;
        return next(error)
    })
    
}

exports.shopOrder=(req,res,next)=>{
    OrderModel.find({'users.userId':req.user._id})
    .then(orders=>{
        console.log('logging from orders', orders.map(p=>p.products));
        res.render('shop/order',{
            path:'/order',
            title:'Order' ,
            orders:orders,
            isAuthenticated: req.session.isLoggedIn
         })
    })
    
}

exports.getInvoice= (req,res,next)=>{
const orderId = req.param.orderId
console.log("orderId",orderId);
const invoiceName = 'invoice-' + orderId + '.pdf'
const pathName= path.join('data', 'invoices', invoiceName)
fs.readFile(pathName, (err,data)=>{
    if(err){
        console.log(err);
        return next(err)
    }
    console.log("data from fs",data);
    res.setHeader('Content-Type', 'application/pdf')
    // res.setHeader('Content-Type', 'application/pdf')
    res.send(data)
})
}