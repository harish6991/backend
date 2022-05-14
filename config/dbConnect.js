const mongoose = require("mongoose");

const connect = async () =>{
  try{
      await mongoose.connect(`mongodb+srv://harish:${process.env.DB_HOST_PASSWORD}@cluster0.777tv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
        .then(()=>{
          console.log("The Connection To DataBase Established")
        })
        .catch((err)=>{
            console.log({message:err})
            process.exit(1)
        })
  }
  catch(err){
      console.log({messaage:err})
      process.exit(1)
  }

}

module.exports = connect;




//
// process.env.DB_HOST
