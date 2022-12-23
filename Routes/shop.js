const express = require('express');
const Router = express.Router();

Router.get('/',(req,res,next)=>{
    console.log("this alternate main route")
    res.send(`<h1>Welcome to my express server</h1>`)
})
module.exports=Router;