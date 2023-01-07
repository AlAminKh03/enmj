const User = require('../models/user')
exports.getAuth=(req,res,next)=>{
    console.log("from auth controller ", req.session.isLoggedIn);
    res.render('auth/login',{
        path:'/login',
        title:'Login' ,
        isAuthenticated: false
     })
}
exports.postAuth = (req,res,next)=>{
    User.findById('63b54f717f36fad43a001e07')
    .then(user=>{
        req.session.isLoggedIn= true
        req.session.user = user
        req.session.save(err=>{
            console.log(err);
            res.redirect('/')
        })
    })
}
exports.postLogout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}