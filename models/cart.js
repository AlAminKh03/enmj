const fs= require('fs');
const path =require('path');
const p= path.join(path.dirname(process.mainModule.filename),
 'data',
 'cart.json')

module.exports= class Cart{
    static addProduct(id,productPrice){
        fs.readFile(p, (err, fileContent) => {
            
            let cart = { products: [], totalPrice: 0 };
        
            if(!err ){
                cart = JSON.parse(fileContent);
            }
    
           
            // checking if same id is already here 
            const existingProductIndex= cart.products.findIndex(prod=>prod.id===id)
            const existingProduct= cart.products[existingProductIndex]
                  
            // adding product or increasing quantity 
                  let updatedProduct;
                  // increasing quantity 
                  if(existingProduct){
                      updatedProduct={...existingProduct};
                      updatedProduct.qty= updatedProduct.qty + 1;
                      cart.products=[...cart.products];
                      cart.products[existingProductIndex]=updatedProduct;
                  }
                  // adding product 
                  else{
                      updatedProduct={id:id, qty:1};
                      cart.products=[...cart.products, updatedProduct]
                  }
                  cart.totalPrice= cart.totalPrice+ +productPrice;
                  fs.writeFile(p,JSON.stringify(cart),(err)=>{
                      console.log("loggin from error");
                  })
            } 
              

              
       )
    }
}