exports.notFound=(req,res,next)=>{
    res.status(404).render('404/404',{
        title:"404 page",
        path:"/404",
        isAuthenticated:  req.session.isLoggedIn
    })
}

exports.errorFix=(req,res,next)=>{
    res.status(500).render('404/500',{
        title:"500 page",
        path:"/500",
        isAuthenticated:  req.session.isLoggedIn
    })
}