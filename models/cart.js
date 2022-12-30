const fs= require('fs');
const path =require('path');
const p= path.join(path.dirname(process.mainModule.filename),
 'data',
 'cart.json')

module.exports= class Cart{
    static addProduct(id,productPrice){
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            console.log({err});
            console.log(fileContent);
            if(cart.products.length > 0){
                cart = JSON.parse(fileContent);
            }
            // checking if same id is already here 
            const existingProductIndex= cart.products.findIndex(prod=>prod.id===id)
            const existingProduct= cart.products[existingProductIndex]
                  
            // adding product or increasing quantity 
                  let updatedProduct;
            // increasing quantity 
                
               if (cart.products.length){ 
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
                }
                  fs.writeFile(p,JSON.stringify(cart),(err)=>{
                      console.log("loggin from error");
                  })
                }
              

              
       )
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p,(err,fileContent)=>{
            if(err){
                return ;
            }
            else{
                const parsedProducts =JSON.parse(fileContent);
                const cartProducts={...parsedProducts}
                const removingProduct = cartProducts.products.find(prod=> prod.id === id)
                const removingProductQty= removingProduct.qty;
                cartProducts.products = cartProducts.products.filter(prod=> prod.id !== id)
                cartProducts.totalPrice= cartProducts.totalPrice - (removingProductQty * productPrice)

                fs.writeFile(p,JSON.stringify(cartProducts),(err)=>{
                    console.log(err);
                })
                
            }
        })
    }
}