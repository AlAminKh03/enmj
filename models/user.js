const mongoose= require('mongoose')
const productModel = require('./product')
const UserSchema= new mongoose.Schema({
  
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    cart:{
        items:[{
            productId:{type: mongoose.Schema.Types.ObjectId, ref:'Products' ,required:true},
            quantity:{type:Number, required:true}
        }]
    }
})

UserSchema.methods.addToCart= function (product){
            const matchedProductIndex = this.cart.items.findIndex(p=>{
                    return  p.productId.toString() === product._id.toString()
                    }
                )
                let newQuantity= 1;
                let updatedCartItems = [...this.cart.items]
                    if(matchedProductIndex >= 0){
                        newQuantity=this.cart.items[matchedProductIndex].quantity + 1 ;
                        updatedCartItems[matchedProductIndex].quantity= newQuantity;
                     }
                    else{
                        updatedCartItems.push({productId: product._id, quantity:newQuantity})
                    }
                const updatedCart={items:updatedCartItems}
                      this.cart= updatedCart  
                    return this.save()
}

UserSchema.methods.getCart= function (){
    const productIds= this.cart.items.map(product=> product.productId)
    return productModel.find({_id:{$in:productIds}}).lean().exec()
    .then(products=>{
        console.log(products);
        return products.map(singleProduct=>{
            return {...singleProduct, quantity: this.cart.items.find(p=>{
                return p.productId.toString() === singleProduct._id.toString()
            }).quantity}
        })
    })
}

UserSchema.methods.deleteCartItem= function(id){
                const remaningCartItems= this.cart.items.filter(item=>{
                    return item.productId.toString() !== id.toString()
                })
                this.cart.items= remaningCartItems;
                return this.save()

}

UserSchema.methods.clearCartItems = function(){
    this.cart.items =[];
    return this.save()
}
module.exports= mongoose.model('Users', UserSchema)

// const mongodb= require('mongodb')
// const getDb= require('../utils/database').getDb
// const UserModel = class User{
//     constructor(userName,email,cart, id){
//         this.userName=userName
//         this.email=email
//         this.cart=cart//{items:[]}
//         this._id= id
//     }
//     save(){
//         const db=getDb()
//             return db.collection('users').insertOne(this)
//                 .then(users=>{
//                     // console.log("from save",  users);
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                 })
//         }

//     addToCart(product){
//         const matchedProductIndex = this.cart.items.findIndex(p=>{
//             return  p._id.toString() === product._id.toString()
//         }
//         )
//         let newQuantity= 1;
//         let updatedCartItems = [...this.cart.items]
//         if(matchedProductIndex >= 0){
//             newQuantity=this.cart.items[matchedProductIndex].quantity + 1 ;
//             updatedCartItems[matchedProductIndex].quantity= newQuantity;
//         }
//         else{
//             updatedCartItems.push({_id: new mongodb.ObjectId(product._id), quantity:newQuantity})
//         }
//         const updatedCart={items:updatedCartItems}
//         const db= getDb();
//         return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})
//     }

//     getCart(){
//         const productIds=this.cart.items.map(productId=> productId._id)
//     const db= getDb();
//     return db.collection('products').find({_id:{$in:productIds}}).toArray()
//     .then(products=>{
//         return products.map(singleProduct=>{
//             return {...singleProduct, quantity: this.cart.items.find(p=>{
//                 return p._id.toString() === singleProduct._id.toString()
//             }).quantity}
//         })
//     })
//     }

//     static findById(id){
//         const db=getDb()
//         return db.collection('users').findOne({_id: new mongodb.ObjectId(id)})
//             .then(user=>{
//                 return user;
//                 })
//             .catch(err=>{
//                 console.log(err);
//                 })
//          }
//     deleteCartItem(id){
//         const remaningCartItems= this.cart.items.filter(item=>{
//             return item._id.toString() !== id.toString()
//         })
//             const db = getDb();
//             return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:remaningCartItems}}})
// }
//   addOrder(){
//     const db=getDb();
    
//     return this.getCart()
//     .then(products=>{
//         const order ={
//             items: products,
//             users:{
//                 _id: new mongodb.ObjectId(this._id),
//                 name:this.userName,
//                 email: this.email
//             }
//         }
//         return db.collection('orders').insertOne(order)
//         .then(result=>{
//             this.cart={items:[]}
//             return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{items:[]}}})
//         })
//     })
    
//   }

//   getOrder(){
//     const db=getDb();
//     return db.collection('orders').find({'users._id': new mongodb.ObjectId(this._id)}).toArray()
//     .then(result=>{
//         console.log("from get orders", result);
//         return result;
//     })
//   }

// }


// module.exports=UserModel