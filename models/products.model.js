const mongoose = require("mongoose");

const Products = mongoose.model('Products',new mongoose.Schema({
    productCode:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        required:true
    },
    imagePath:{
      type:String,
      required:true
    },
    description:{
      type:String,
      require:true
    },
    price:{
      type:Number,
      required:true
    },
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"category"
    },
    avilable:{
      type:Boolean,
      required:true
    },
    createdAt:{
      type:Date,
      default:Date.now,
    }
}))
module.exports = Products;
