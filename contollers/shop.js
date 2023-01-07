const productModel =require("../models/product")
const cartModel=require("../models/cart")
const UserModel = require("../models/user")
const mongodb= require("mongodb")
const OrderModel = require("../models/order")


exports.shopIndex=(req,res,next)=>{
    productModel.find()
    .then(products=>{
            res.render("shop/index",{
                prods:products,
                path:'/', 
                title: "shop",
                isAuthenticated: req.isLoggedIn
            })
    })
    .catch(err=>{
        console.log(err);
    })
}
exports.shopProductList=(req,res,next)=>{
    productModel.find()
    .then(products=>{
        res.render("shop/product-list",{
            prods:products,
            path:'/product-list', 
            title: "product-list",
            isAuthenticated: req.isLoggedIn
        })
})
.catch(err=>{
    console.log(err);
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
        isAuthenticated: req.isLoggedIn
    })
 })
}
exports.shopCart = (req, res, next) => {
    req.session.user.populate('cart.items.productId')
    .then(products=>{
        const Cartproducts= products.cart.items
        res.render('shop/cart', {
            path: '/cart',
            title: 'Cart',
            products: Cartproducts,
            isAuthenticated: req.isLoggedIn
          })
    })
  }
exports.postProduct=(req,res,next)=>{
    const prodId= req.body.productId;
    productModel.findById(prodId)
   .then(product=>{
    return req.session.user.addToCart(product) 
   })
   .then(result=>{
    // console.log("consolling from post product", result);
    res.redirect('/cart')
   })
    
}

exports.deleteCartProduct=(req,res,next)=>{
    const prodId = req.body.productId;
    req.session.user.deleteCartItem(prodId)
    .then(result=>{
        res.redirect('/cart')
    })

}
exports.postOrder=(req,res,next)=>{
    req.session.user.populate('cart.items.productId')
    .then(user=>{
      const productData = user.cart.items.map(p=>{
        return { product: {...p.productId._doc}, quantity: p.quantity}
      })
      console.log(productData);
      const order = new OrderModel({
        products: productData,
        users:{
            name: req.session.user.name,
            userId: req.session.user
        }
      })
      return order.save()
    })
    .then(result=>{
        req.session.user.clearCartItems()
        res.redirect('/order')
    })
    .catch(err=>{
        console.log(err);
    })
    
}

exports.shopOrder=(req,res,next)=>{
    OrderModel.find({'users.userId':req.session.user._id})
    .then(orders=>{
        console.log('logging from orders', orders.map(p=>p.products));
        res.render('shop/order',{
            path:'/order',
            title:'Order' ,
            orders:orders,
            isAuthenticated: req.isLoggedIn
         })
    })
    
}