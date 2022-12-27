exports.notFound=(req,res,next)=>{
    res.status(404).render('404/404',{title:"404 page",path:"/404"})
}