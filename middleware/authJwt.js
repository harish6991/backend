const jwt  = require("jsonwebtoken");
const db = require("../models");
const ErrorHandler = require("../utils/errorHandler");
const User = db.users;
const Roles  = db.roles;
const {TokenExpiredError} = jwt;

const catchError = (err,res,next)=>{
    if(err instanceof TokenExpiredError){
      return next(new ErrorHandler("Token Has Expired",401))
    }
    return next(new ErrorHandler("Unauthorized",401));
}

let verifyToken = (req,res,next)=>{
  let token = req.headers["x-access-token"]
  if(!token){
      return next(new ErrorHandler("No Token Provided",403))
  }
  jwt.verify(token,process.env.PASSWORD_SECRET,(err,decode)=>{
    if(err){
        return next(new ErrorHandler("Unauthorized",401))
    }
    req.userId = decode.id
    next()
  })
}

let isAdmin = (req,res,next)=>{
  User.findById(req.userId).exec((err,user)=>{
      if(err){
          return  next(new ErrorHandler(err,500))
      }
      Roles.find({
        _id:{$in:user.roles}
      },(err,roles)=>{
          if(err){
            return  next(new ErrorHandler(err,500))
          }
          for(let i=0;i<roles.length;i++){
            if(roles[i].name === "admin"){
              return next()
            }
          }
          return  next(new ErrorHandler("Admin Role Not Found",403))
      })


  })
}


let isUser = (req,res,next)=>{
    User.findById(req.userId).exec((err,user)=>{
      if(err){
        return  next(new ErrorHandler(err,500))
      }
      Roles.find({
        _id:{$in:user.roles}
      },(err,roles)=>{
          if(err){
            return  next(new ErrorHandler(err,500))
          }
          for(let i=0;i<roles.length;i++){
              if(roles[i].name === "user"){
                return next();
              }
          }
          return  next(new ErrorHandler("User Role Not Found",403))
      })
    })
}

let isGuest =(req,res,next)=>{
  User.findById(req.userId).exec((err,user)=>{
      if(err){
          return  next(new ErrorHandler(err,500))
      }
      Roles.find({
        _id:{$in:user.roles}
      },(err,roles)=>{
          if(err){
            return  next(new ErrorHandler(err,500))
          }
          for(let i=0;i<roles.length;i++){
              if(roles[i].name === "guest"){
                return next();
              }
          }
          return  next(new ErrorHandler("Guest Role Not Found",403))


      })
  })

}

const authJwt = {
  verifyToken,
  catchError,
  isAdmin,
  isUser,
  isGuest
}

module.exports =authJwt;
