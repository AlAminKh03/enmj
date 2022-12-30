
const path = require('path')
const fs= require('node:fs')
const cartModel = require('./cart')

const p= path.join(path.dirname(process.mainModule.filename),
 'data',
 'products.json')

const getFileFromFile=(cb)=>{
    fs.readFile(p,(err,fileContent)=>{
        if (err){
          cb([]) 
        }
        else{
            cb(JSON.parse(fileContent))
        }
    })}

module.exports= class Product {
    constructor(id,title,ImgUrl, price,description){
        this.title=title
        this.ImgUrl=ImgUrl
        this.price=price
        this.description=description
        this.id=id
    }
    save(){
        if(this.id){
             getFileFromFile(products=>{
            const existingIdIndex= products.findIndex(product=> product.id===this.id)
            const updatedProduct=[...products];
            updatedProduct[existingIdIndex]=this
            fs.writeFile(p,JSON.stringify(updatedProduct),(err)=>{
                console.log(err);
            })
             })}
    else{
        this.id= Math.random().toString();
        getFileFromFile(product=>{
            product.push(this);
            fs.writeFile(p,JSON.stringify(product),(err)=>{
            console.log(err);
        })
    })}}

    static fetchData(cb){
       getFileFromFile(cb)
    }

    static findById(id,cb){
        getFileFromFile(product=>{
            const desiredId= product.find(p => p.id === id)
            cb(desiredId)
        })
    }
    static deleteData(id){
        getFileFromFile(products=>{
            const desiredId = products.findIndex(product=>product.id === id)
            const desiredProduct = products.find(product=>product.id === id)
            const remainingProduct = [...products];
            remainingProduct.splice(desiredId,1);
            fs.writeFile(p,JSON.stringify(remainingProduct),(err)=>{
                if(!err){
                   cartModel.deleteProduct(id, desiredProduct.price) 
                }
            })
        })
    }
}