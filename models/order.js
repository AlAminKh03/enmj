const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    products : [
       { 
        product:{type: Object, required:true},
        quantity:{type:Number, required:true}
    }
],
    users: {
        email:{type:String, required:true},
        userId:{type : mongoose.Schema.Types.ObjectId, required:true, ref:'Users'}
    }
})

module.exports = mongoose.model('Orders', OrderSchema);