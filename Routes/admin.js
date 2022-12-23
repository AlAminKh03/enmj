const express= require('express');
const Router = express.Router()

Router.get('/add-products',(req,res,next)=>{
    console.log('This is product route')
    res.send('<form action="/product" method="POST"><input type="text" name="item"/><button type="submit">submit</button></form>')
})
Router.post('/product',(req,res,next)=>{
    const body= req.body;
    console.log(body);
    res.redirect('/')
})

module.exports=Router
