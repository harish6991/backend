const mongoose = require("mongoose");
const connect = async () =>{
  try{
      await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
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
