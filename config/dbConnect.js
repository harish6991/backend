const mongoose = require("mongoose");

const connect = async () =>{
  try{
      await mongoose.connect(`mongodb+srv://${process.env.DB_USER_LIVE}:${process.env.DB_HOST_PASSWORD}@cluster0.xvkpaz9.mongodb.net/?retryWrites=true&w=majority`)
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
