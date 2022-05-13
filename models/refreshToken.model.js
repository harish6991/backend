const mongoose = require("mongoose");
const RefreshToken  = mongoose.model('RefreshToken',new mongoose.Schema({
    token:String,
    expiryDate:Date,
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }

  }));
module.exports = RefreshToken;
