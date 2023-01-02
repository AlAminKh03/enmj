const mongodb= require('mongodb')
const getDb= require('../utils/database').getDb
const UserModel = class User{
    constructor(userName,email,cart, id){
        this.userName=userName
        this.email=email
        this.cart=cart//{items:[]}
        this._id= id
    }
    save(){
        const db=getDb()
            return db.collection('users').insertOne(this)
                .then(users=>{
                    console.log(users);
                })
                .catch(err=>{
                    console.log(err);
                })
        }

    addToCart(product){
        const matchedProductIndex = this.cart.items.findIndex(p=>{
            return  p._id.toString() === product._id.toString()
        }
        )
        let newQuantity= 1;
        let updatedCartItems = [...this.cart.items]
        if(matchedProductIndex){
            newQuantity=this.cart.items[matchedProductIndex].quantity + 1 ;
            updatedCartItems[matchedProductIndex].quantity= newQuantity;
        }
        else{
            updatedCartItems.push({_id: new mongodb.ObjectId(product._id), quantity:newQuantity})
        }
        const updatedCart={items:updatedCartItems}
        const db= getDb();
        return db.collection('users').updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})
    }

    static findById(id){
        const db=getDb()
        return db.collection('users').findOne({_id: new mongodb.ObjectId(id)})
            .then(user=>{
                return user;
                })
            .catch(err=>{
                console.log(err);
                })
         }
}

module.exports=UserModel