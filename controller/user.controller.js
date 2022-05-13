const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sendConfrimationEmail,passwordResetting} = require("../utils/helper");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncError = require("../middleware/catchAsyncError");
const User = db.users;
const Role = db.roles;
const RefreshToken  = db.refreshToken;

exports.signUp = CatchAsyncError((req,res,next)=>{
  const token = jwt.sign({email: req.body.email}, process.env.PASSWORD_SECRET)
  const user = new User({
      username:req.body.name,
      email:req.body.email,
      password:bcrypt.hashSync(req.body.password,8),
      confirmationCode:token
  })
  user.save((err,user)=>{
      if(err){
          return next(new ErrorHandler(err,500))
      }
      if(req.body.roles){
        Role.find({name:{$in:req.body.roles}},(err,roles)=>{
            if(err){
              return next(new ErrorHandler(err,500))
            }
            user.roles =  roles.map(role=>role._id)
            user.save((err)=>{
                if(err){
                  return next(new ErrorHandler(err,500))
                }
                res.status(201).send({message:"User was registered successfully! Please check your email"})
            })
        })
      }
      else{
        Role.findOne({name:'guest'},(err,roles)=>{
            if(err){
              return next(new ErrorHandler(err,500))
            }
            user.roles = [roles.id];
            user.save((err)=>{
                if(err){
                    return next(new ErrorHandler(err,500))
                }
                res.status(201).send({message:"User was registered successfully! Please check your email"});
            })

        })
      }
      sendConfrimationEmail(req.body.name,req.body.email,token)

  })

})
//sign In User
exports.signIn = CatchAsyncError((req,res,next)=>{
  User.findOne({email:req.body.email}).populate("roles","-__v").exec((err,user)=>{
      let token ={};
      if(err){
          return next(new ErrorHandler(err,500))
      }
      if(!user){
          return next(new ErrorHandler("User Not Found",400))
      }
      // checking the password
      let validPassword = bcrypt.compareSync(req.body.password,user.password);
      if(!validPassword){
          return next(new ErrorHandler("Invalid Password",401))
      }
      // checking if the user is Active or Not
      if(user.status === "Pending"){
        return next(new ErrorHandler("Pending Account Please verify your Email",403))
      }


      // setting up data for token
      let authorities = []
      for(let i=0;i<user.roles.length;i++){
         authorities.push("ROLE_"+user.roles[i].name.toUpperCase())
      }
      let userInfo = {id:user.id,email:user.email,role:authorities,status:user.status}
      // setting up Expiry time For refresh Token
      let setExpiryTime = new Date();
      setExpiryTime = setExpiryTime.getTime() +process.env.REFRESH_TOKEN*1000
      // genrating eacess Token And Refersh Token
      token.access =jwt.sign(userInfo,process.env.PASSWORD_SECRET,{expiresIn:process.env.ACCESS_TOKEN/60+"min"})
      token.refresh = jwt.sign({id:user.id},process.env.PASSWORD_SECRET,{expiresIn:process.env.REFRESH_TOKEN/60+"min"})
      //saving Refresh Token To database And User
      RefreshToken.findOne({userId:user.id})
      .then((user_data)=>{
        if(user_data!== null){
         RefreshToken.findOneAndUpdate({userId:user_data.userId}).then((updated_user)=>{
             updated_user.token = token.refresh
             updated_user.expiryDate = setExpiryTime;
             updated_user.save()
           })
        }
        else{
          new RefreshToken({token:token.refresh,expiryDate:setExpiryTime,userId:userInfo.id}).save()
        }

      })
      .catch((err)=>next(new ErrorHandler(err,500)))

      return res.status(200).send(token)
  })
})

// creating the Refresh Token
exports.refreshToken =CatchAsyncError((req,res,next)=>{
  RefreshToken.findOne({token:req.body.refresh}).populate("userId","-__v").then((user)=>{
      var currentDate = new Date();
      if(currentDate.getTime() > user.expiryDate.getTime()){
        return res.status(200).send({message:"Token Has Expired"})
      }
      else{
        User.findOne({username:user.userId.username}).populate("roles","-__v").exec((err,user)=>{
          if(err){
               return res.status(500).send({message:err})
          }
          let authorities = [];
          for(let i=0;i<user.roles.length;i++){
             authorities.push("ROLE_"+user.roles[i].name.toUpperCase())
          }
          var currentDate = new Date();
          let user_data = {id:user._id,name:user.username,email:user.email,roles:authorities}
          let token = jwt.sign(user_data,process.env.PASSWORD_SECRET,{expiresIn:process.env.ACCESS_TOKEN/60+"min"})
          return res.status(200).send({token:token})
      })
    }

  }).catch((err)=>next(new ErrorHandler(err,500)))

})

// Testing User Access
exports.userAccess = (req,res,next)=>{
    res.status(200).send({message:"User Access"})
}

//Testing Admin Access
exports.adminAccess =(req,res,next)=>{
  res.status(200).send({message:"Admins Access"})
}

//Testing Guest Access
exports.guestAccess = (req,res,next)=>{
    res.status(200).send({message:"Guest Access"})
}

// getting the User Count
exports.gettingTheUsers = CatchAsyncError((req,res,next)=>{
  User.find({},{password:0}).populate("roles","-__v")
  .then((user)=>{
    res.status(200).send(user)
  })
  .catch((err)=>next(new ErrorHandler(err,500)))
})

// verify the Email Of registered User
exports.verifyUser = CatchAsyncError((req,res,next)=>{
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((user)=>{
    if(!user) {
       return res.status(404).send({ message: "User Not found." });
     }
     user.status = "Active";
     user.save((err) => {
       if (err) {
        res.status(500).send({ message: err });
        return;
      }
    });
  })

  return res.redirect('/#/welcome')
})

// resetting the Password;
exports.resetPassword = CatchAsyncError((req,res,next)=>{
  User.findOne({email:req.body.email}).then((user)=>{
    if(!user){
      return res.status(404).send({message:"User Not Found"})
    }
    passwordResetting(user.username,user.email,user.confirmationCode)
    return res.status(200).send({message:"Reset Password Link Has Been Send To Your Email Account"})
  })

})

// update PASSWORD
exports.updatePassword = CatchAsyncError((req,res,next)=>{
   User.findOneAndUpdate({email:req.body.email},{password:bcrypt.hashSync(req.body.password,8)})
   .then((req)=>{ return res.status(200).send({message:"Password Has Been Updated Successfully"})})
   .catch((err)=>{return res.status(500).send({message:err})})

})
