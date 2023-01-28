const productModel =require("../models/product")
const cartModel=require("../models/cart")
const UserModel = require("../models/user")
const mongodb= require("mongodb")
const OrderModel = require("../models/order")
const fs= require('fs')
const path= require('path')
const PDFDocument = require('pdfkit')
const PAGE_PER_LIMIT = 2;

exports.shopIndex=(req,res,next)=>{
    const page = req.query.page;
    let totalItems;
    productModel.countDocuments()
    .then(productNumbers=>{
        totalPage=productNumbers;
        return productModel.find()
        .skip((page-1)* PAGE_PER_LIMIT)
        .limit(PAGE_PER_LIMIT)
    })
    .then(products=>{
            res.render("shop/index",{
                prods:products,
                path:'/', 
                title: "shop",
                isAuthenticated: req.session.isLoggedIn,
                totalProducts:totalItems,
                hasNestPage: (PAGE_PER_LIMIT * page) < totalPage,
                hasPreviousPage:page>1,
                totalPages: totalItems/PAGE_PER_LIMIT,
                nextPage: page +1,
                previousPage: page - 1
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
        res.render('shop/order',{
            path:'/order',
            title:'Order' ,
            orders:orders,
            isAuthenticated: req.session.isLoggedIn
         })
    })
    
}

exports.getInvoice= (req,res,next)=>{
const orderId = req.params.orderId
console.log(orderId);
OrderModel.findById(orderId)
.then(order=>{
    console.log("from db", order);
if(!order){
    return next(new Error('No order found'))
}
if(order.users.userId.toString()!== req.user._id.toString()){
    return next(new Error('unauthorized user'))
}

console.log("orderId",orderId);
const invoiceName = 'invoice-' + orderId + '.pdf'
const pathName= path.join('data', 'invoices', invoiceName)

const pdfdoc= new PDFDocument(); //it's a readalbe stream
res.setHeader('Content-Type', 'application/pdf')
res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
pdfdoc.pipe(fs.createWriteStream(pathName))
pdfdoc.pipe(res)
pdfdoc.fontSize(24).text('Invoice')
pdfdoc.text('company-name: nodefirm')
pdfdoc.text('----------------')
order.products.forEach(prod=>{
    pdfdoc.text('name: ' + prod.product.title)
    pdfdoc.text('price: ' + prod.product.price)
    pdfdoc.text('totalPrice: ' + prod.quantity)
})

pdfdoc.end()
// const pdfDoc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader(
//         'Content-Disposition',
//         'inline; filename="' + invoiceName + '"'
//       );
//       pdfDoc.pipe(fs.createWriteStream(pathName));
//       pdfDoc.pipe(res);

//       pdfDoc.fontSize(26).text('Invoice', {
//         underline: true
//       });
//       pdfDoc.text('-----------------------');
//       let totalPrice = 0;
//       order.products.forEach(prod => {
//         totalPrice += prod.quantity * prod.product.price;
//         pdfDoc
//           .fontSize(14)
//           .text(
//             prod.product.title +
//               ' - ' +
//               prod.quantity +
//               ' x ' +
//               '$' +
//               prod.product.price
//           );
//       });
//       pdfDoc.text('---');
//       pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

//       pdfDoc.end();
})
.catch(err=>{
    return next(err)
})
}