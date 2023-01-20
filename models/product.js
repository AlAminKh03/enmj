const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ImgUrl:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
})

module.exports = mongoose.model('Products',productSchema)

// const mongodb=require('mongodb')
// const path = require('path')
// const fs= require('node:fs')
// const cartModel = require('./cart')
// const getDb = require('../utils/database').getDb

// const p= path.join(path.dirname(process.mainModule.filename),
//  'data',
//  'products.json')

// const getFileFromFile=(cb)=>{
//     fs.readFile(p,(err,fileContent)=>{
//         if (err){
//           cb([]) 
//         }
//         else{
//             cb(JSON.parse(fileContent))
//         }
//     })}

// // module.exports= class Product {
// //     constructor(id,title,ImgUrl, price,description){
// //         this.title=title
// //         this.ImgUrl=ImgUrl
// //         this.price=price
// //         this.description=description
// //         this.id=id
// //     }
// //     save(){
// //         if(this.id){
// //              getFileFromFile(products=>{
// //             const existingIdIndex= products.findIndex(product=> product.id===this.id)
// //             const updatedProduct=[...products];
// //             updatedProduct[existingIdIndex]=this
// //             fs.writeFile(p,JSON.stringify(updatedProduct),(err)=>{
// //                 console.log(err);
// //             })
// //              })}
// //     else{
// //         this.id= Math.random().toString();
// //         getFileFromFile(product=>{
// //             product.push(this);
// //             fs.writeFile(p,JSON.stringify(product),(err)=>{
// //             console.log(err);
// //         })
// //     })}}

// //     static fetchData(cb){
// //        getFileFromFile(cb)
// //     }

// //     static findById(id,cb){
// //         getFileFromFile(product=>{
// //             const desiredProduct= product.find(p => p.id === id)
// //             cb(desiredProduct)
// //         })
// //     }
// //     static deleteData(id){
// //         getFileFromFile(products=>{
// //             const desiredId = products.findIndex(product=>product.id === id)
// //             const desiredProduct = products.find(product=>product.id === id)
// //             const remainingProduct = [...products];
// //             remainingProduct.splice(desiredId,1);
// //             fs.writeFile(p,JSON.stringify(remainingProduct),(err)=>{
// //                 if(!err){
// //                    cartModel.deleteProduct(id, desiredProduct.price) 
// //                 }
// //             })
// //         })
// //     }
// // }



// const productModel= class Product {
//     constructor(title,ImgUrl, price,description,id,userId){
//                 this.title=title
//                 this.ImgUrl=ImgUrl
//                 this.price=price
//                 this.description=description
//                 this._id=id
//                 this.userId= userId
//             }

//     save(){
//         // console.log(this._id);
//         // console.log(mongodb.ObjectId(this._id));
//         const db= getDb()
//         let dbOp;
//         if(this._id){
//             dbOp=db.collection('products')
//             .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this})
//             }
//         else{
//             dbOp=db.collection('products').insertOne(this)
//             }
//         return dbOp.then(res=>{
//             // console.log("this one from product save()", res);
//             })
//             .catch(err=>{
//                 console.log(err);
//             })
//     }
    
//     static fetchData(){
//                const db=getDb()
//                return db.collection('products').find().toArray()
//                .then(result=>{
//                 // console.log(result);
//                 return result;
//                })
//                .catch(err=>{
//                 console.log(err);
//                })
//             }
        
//     static findById(id){
//         const db=getDb()
//         return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next()
//         .then(product=>{
//             // console.log(product);
//             return product;
//          })
//         .catch(err=>{
//             console.log(err);
//              })
//         }
//     static deleteData(id){
//         const db=getDb()
//         return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
//         .then(result=>{
//             // console.log("this one from delete", result);
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }
// }

// module.exports = productModel;