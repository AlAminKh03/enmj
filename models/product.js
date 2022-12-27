
const path = require('path')
const fs= require('node:fs')

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
    constructor(title,ImgUrl, price,description){
        this.title=title
        this.ImgUrl=ImgUrl
        this.price=price
        this.description=description
    }
    save(){
        this.id= Math.random().toString();
            getFileFromFile(product=>{
                product.push(this);
                fs.writeFile(p,JSON.stringify(product),(err)=>{
                console.log(err);
            })
        }) 
    }
    static fetchData(cb){
       getFileFromFile(cb)
    }

    static findById(id,cb){
        getFileFromFile(product=>{
            const desiredId= product.find(p => p.id === id)
            cb(desiredId)
        })
    }
}