const mongoose = require("mongoose");
const category = mongoose.model('Category',new mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    slug:{
      type:String,
      required:true,
      slug:"title"
    }
}))


module.exports = category
