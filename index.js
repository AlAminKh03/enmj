// core built in module 
const http= require('node:http')
const path = require("path")
const mongoose= require('mongoose')
const session= require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')


// relative path 
const adminRoutes =require('./Routes/admin')
const shopRoutes= require("./Routes/shop")
const authRoutes= require("./Routes/auth")
const notFound= require("./contollers/404")
const UserModel = require('./models/user')

// 3rd party module 
const express= require('express')
const bodyParser=require("body-parser")
const app = express()
const csrfProtection = csrf()

const MONGO_URI ='mongodb+srv://node-farm:vMSHxGGr2dHzDbXg@cluster0.n4boazi.mongodb.net/shop?retryWrites=true&w=majority'

const store = new MongoDBStore({
    uri: MONGO_URI,
    collection:'sessions'
})
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
// middleware 
app.use(session({
    secret:"my secret",
    resave:false, 
    saveUninitialized:false,
    store:store
}))
app.use(csrfProtection)



app.set('view engine', 'ejs')
app.set('views', 'views')


app.use((req,res,next)=>{
    console.log("from index", req.session.user);
    if(!req.session.user){
        return next()
    }
    UserModel.findById(req.session.user._id)
    .then(user=>{
        req.user = user
        // console.log({user});
        next()
    })
    .catch(err=>{
        console.log(err);
    })
})

app.use((req,res,next)=>{
    res.locals.isAuthenticated= req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    console.log(res.locals.csrfToken);
    next()
})
app.use('/admin',adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(notFound.notFound)


mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI, { useNewUrlParser: true })
.then(result=>{
    app.listen(8000)
    console.log("Connected");
})
.catch(err=>{
    console.log(err);
})


// const readingInput = fs.readFileSync('./txt/input.txt','utf-8')
// console.log(readingInput);

// const writingForWrite = `this text for writing a file \n i mean creating a file ${readingInput}`
// fs.writeFileSync('./txt/output.txt', writingForWrite)
// console.log("done writing file");

// const dataJson=fs.readFileSync(`${__dirname}/data.json`,'utf-8')
// console.log(dataJson);
// const dataObj = JSON.parse(dataJson);


// const server = http.createServer((req,res)=>{
//     const pathName=req.url;
//     console.log(pathName);
//     if (pathName=== '/' || pathName==='/overview'){
//         res.end("Hello from the server")
//     }
//     else if(pathName === '/product'){
//         res.end("Product Page")
//     }
//     else if(pathName === '/api'){
//         res.writeHead(200,{
//            "Content-type" : "application/json"
//         })
//         res.end(dataJson)
//     }
//     else{
//         res.writeHead(404,{
//             'Content-type':'text/html'
//         })
//         res.end("page not found")
//     }
    
    
// })