const mongodb= require('mongodb')
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect=(callback)=>{
    MongoClient.connect('mongodb+srv://node-farm:vMSHxGGr2dHzDbXg@cluster0.n4boazi.mongodb.net/shop?retryWrites=true&w=majority')
    .then(res=>{
        console.log('connected');
        _db= res.db()
        callback()
      
    })
    .catch(err=>{
        console.log(err);
        throw err;
    })
}

const getDb =()=>{
    if(_db){
        return _db
    }
    throw "No database connected"
}

module.mongoConnect=mongoConnect;
module.getDb=getDb;
