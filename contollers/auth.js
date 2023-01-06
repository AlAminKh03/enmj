exports.getAuth=(req,res,next)=>{
    const isLoggedIn= req.get('Cookie').split('=')[1];
    res.render('auth/login',{
        path:'/login',
        title:'Login' ,
        isAuthenticated: isLoggedIn
     })
}
exports.postAuth = (req,res,next)=>{
res.setHeader('set-Cookie', 'isLoggedIn=true')
    res.redirect('/')
}