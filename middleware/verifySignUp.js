const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError")
const db = require("../models");
const User = db.users;
const Role = db.ROLES;

let checkDuplicateNameOrEmail =catchAsyncError(async(req,res,next)=>{
  let errorData = {};
  User.findOne({email:req.body.email},(err,email)=>{
      if(err){
        return next(new ErrorHandler(err,500))
      }
      if(email !== null){
        errorData.emailError = "Email Already In Use";
      }
      if(Object.keys(errorData).length !== 0){
        return res.status(200).send(errorData)
      }else{
        next()
      }
  })



})

let checkRoleExisted = (req,res,next)=>{
    if(req.body.roles){
      for(let i =0;i<req.body.roles.length;i++){
          if(!Role.includes(req.body.roles[i])){
            return res.status(400).send({messsage:`The Role ${req.body.roles[i]} does not Exists`})

          }

      }
    }
    next()

}


const verifySignUp ={
  checkDuplicateNameOrEmail,
  checkRoleExisted
}

module.exports  = verifySignUp;
