const bcrypt = require('bcryptjs')
const User = require('../models/user')
exports.getAuth=(req,res,next)=>{
    console.log("from auth controller ", req.session.isLoggedIn);
    res.render('auth/login',{
        path:'/login',
        title:'Login' ,
        isAuthenticated: req.session.isLoggedIn
     })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      title: 'Signup',
      isAuthenticated: false
    });
  };

  
exports.postAuth = (req,res,next)=>{
    const email= req.body.email;
    const password = req.body.password
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.send(`Email isn't found`)
        }
        bcrypt.compare(password, user.password)
        .then(matched=>{
            if (!matched){
                return res.send('password does not match')
            }
            req.session.isLoggedIn= true
            req.session.user = user
            return req.session.save(err=>{
            console.log(err);
            res.redirect('/')
        })
        })
        
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword= req.body.confirmPassword;

    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            return res.redirect('/login')
        }
        return bcrypt.hash(password, 12)
        .then(cryptedPasword=>{
            const user = new User({
                email:email ,
                password: cryptedPasword ,
                cart:{
                    items:[]
                }
            })
            return user.save()
        })
        
    })
    .then(result=>{
        return res.redirect('/login')
    })
    .catch(err=>{
        console.log(err);
    })
};


exports.postLogout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}