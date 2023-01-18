const bcrypt = require('bcryptjs')
const crypto= require('crypto')
const {validationResult}= require('express-validator')
const User = require('../models/user')
const nodemailer= require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:process.env.API_KEY
    }
}))

exports.getAuth=(req,res,next)=>{
let errorMsg = req.flash('error')
let successMsg= req.flash('success')
  if(errorMsg.length > 0){
      errorMsg=errorMsg[0]
  }else{
    errorMsg=null
  }
  if(successMsg.length > 0){
      successMsg=successMsg[0]
    }else{
        successMsg=null
    }
  res.render('auth/login',{
        path:'/login',
        title:'Login',
        flashMsg:errorMsg,
        flashSuccessMsg :successMsg,
        oldInput:{
          email:'',
          password: ''
        }
     })
}

exports.getSignup = (req, res, next) => {
    let errorMsg = req.flash('error')
    
    if(errorMsg.length > 0){
    errorMsg=errorMsg[0]
    }else{
    errorMsg=null
    }
    res.render('auth/signup', {
      path: '/signup',
      title: 'Signup',
      flashErrMsg:errorMsg,
      oldInput:{
        email:'',
        password: '',
        confirmPassword: ''
      }
      
    });
  };

  
exports.postAuth = (req,res,next)=>{
    const email= req.body.email;
    const password = req.body.password
    const errors= validationResult(req)
    console.log(errors);
    if (!errors.isEmpty()){
      return res.status(422).render('auth/login',{
        path: '/login',
        title: 'Login',
        flashErrMsg:errors.array()[0].msg,
        oldInput:{
          email:email,
          password: password,
        }
      })
    }
    User.findOne({email:email})
    .then(user=>{
        if(!user){
            return res.status(422).render('auth/login',{
              path: '/login',
              title: 'Login',
              flashErrMsg:'email is invalid',
              oldInput:{
                email:email,
                password: password,
              }
            })
        }
      bcrypt.compare(password, user.password)
        .then(matched=>{
            if (!matched){
              return res.status(422).render('auth/login',{
                path: '/login',
                title: 'Login',
                flashErrMsg:'Password is invalid',
                oldInput:{
                  email:email,
                  password: password,
                }
              })
            }
            req.session.isLoggedIn= true
            req.session.user = user
            return req.session.save(err=>{
            console.log(err);
            res.redirect('/')
        })
      })
      .catch(err=>{
        console.log(err);
      })
        
    })
}

// exports.postSignup = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const confirmPassword= req.body.confirmPassword;

//     User.findOne({email:email})
//     .then(userDoc=>{
//         if(userDoc){
//             req.flash('error',' User already exists')
//             return res.redirect('/signup')
//         }
//         return bcrypt.hash(password, 12)
//         .then(cryptedPasword=>{
//             const user = new User({
//                 email:email ,
//                 password: cryptedPasword ,
//                 cart:{
//                     items:[]
//                 }
//             })
//             return user.save()
//         }) 
//     .then(result=>{
//         req.flash('success',"User Created Successfully")
//          res.redirect('/login')
//          console.log(email);
//         return transporter.sendMail({
//             to:email,
//             from: 'alaminkhan6203@gmail.com',
//             subject:' successfully verified',
//             html:'<h1>Your Account successfully verified</h1>'
//         })
//     })
// })
// .catch(err=>{
//         console.log(err);
//     })
// };
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req)
    console.log(errors.array())
    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup', {
        path: '/signup',
        title: 'Signup',
        flashErrMsg:errors.array()[0].msg,
        oldInput:{
          email:email,
          password: password,
          confirmPassword: req.body.confirmPassword
        }
      })
    }
  bcrypt
        .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword,
              cart: { items: [] }
            });
            return user.save();
          })
          .then(result => {
            req.flash('success',"User Created Successfully")
            res.redirect('/login');
            return transporter.sendMail({
              to: email,
              from: 'alaminkhan6203@gmail.com',
              subject: 'Signup succeeded!',
              html: '<h1>You successfully signed up!</h1>'
            });
          })
          .catch(err => {
            console.log(err);
          });
  };


exports.postLogout = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}

exports.getResetPass = (req,res,next)=>{
  let errorMsg = req.flash('error')
let successMsg= req.flash('success')
if(errorMsg.length > 0){
    errorMsg=errorMsg[0]
}else{
    errorMsg=null
}
if(successMsg.length > 0){
    successMsg=successMsg[0]
    }else{
        successMsg=null
    }
    res.render('auth/reset',{
        path:'/reset',
        title:'Reset Password',
        flashMsg:errorMsg,
        flashSuccessMsg :successMsg
     })
}

exports.postResetPass= (req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        req.flash('error', 'Invalid email address')
        return res.redirect('/reset')
      }
      user.resetToken= token;
      user.resetTokenExpiration = Date.now() + 3600000
      return user.save()
      .then(result=>{
        req.flash('success', 'Reset token has send your email.')
        res.redirect('/')
        transporter.sendMail({
          to: req.body.email,
          from: 'alaminkhan6203@gmail.com',
          subject: 'reset your passwords',
          html: `<p>you requested a password reset</p>
          <p>to reset your password please click on this  <a href="http://localhost:8000/reset/${token}">link</a></p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      })
    })
  })
}


exports.getNewPassword =(req,res,next)=>{
  const token= req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt: Date.now()} })
  .then(user=>{
    let errorMsg = req.flash('error')
    let successMsg= req.flash('success')
    if(errorMsg.length > 0){
        errorMsg=errorMsg[0]
    }else{
        errorMsg=null
    }
    if(successMsg.length > 0){
        successMsg=successMsg[0]
        }else{
            successMsg=null
        }
        res.render('auth/new-password',{
            path:'/new-password',
            title:'New Password',
            flashMsg:errorMsg,
            flashSuccessMsg :successMsg,
            userId:user._id,
            resetToken:token
         })
  }
    
  ).catch(err=>{
    console.log(err);
  })
}

exports.postNewPassword=(req,res,next)=>{
  const resetPassword = req.body.password;
  const resetToken= req.body.resetToken;
  const userId= req.body.userId;
  let resetUser;
  User.findOne({resetToken:resetToken, resetTokenExpiration:{$gt:Date.now()},_id:userId})
  .then(user=>{
    resetUser=user
    return bcrypt.hash(resetPassword,12)
  })
  .then(hasedPassword=>{
    resetUser.password=hasedPassword
    resetUser.resetToken= undefined
    resetUser.resetTokenExpiration= undefined
    return resetUser.save()
  })
  .then(reult=>{
    res.redirect('/login')
  })
  .catch(err=>{
    console.log(err);
  })
}