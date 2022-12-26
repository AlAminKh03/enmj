
const path = require('path')
const fs= require('node:fs')


module.exports= class Product {
    constructor(title){
        this.title=title
    }
    save(){
        const p= path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
        fs.readFile(p,(err,fileContent)=>{
            let product="string";
            if (!err){
             product= JSON.parse(fileContent);
             console.log(product);
             console.log(typeof product);
            }
            product.push(this);
                fs.writeFile(p,JSON.stringify(product),(err)=>{
            })
        })
    }
    static fetchData(cb){
        const p= path.join(path.dirname(process.mainModule.filename), 'data', 'products.json')
        fs.readFile(p,(err,fileContent)=>{
            if (err){
              cb([]) 
            }
         cb(JSON.parse(fileContent))
        })
    }
}