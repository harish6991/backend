const db = require("../models");
const Roles = db.roles;
const RefreshToken = db.refreshToken;
exports.makeCollection = ()=>{
  Roles.collection.estimatedDocumentCount((err,count)=>{
      if(!err && count === 0){
        new Roles({name:"user"}).save((err)=>{
              if(err){
                  console.log('error',err)
              }
            console.log('User Collection Has Been Created')
        })
        new Roles({name:"admin"}).save((err)=>{
            if(err){
                console.log('error',err)
            }
            console.log('Admin Collection Has Been Created')
        })
        new Roles({name:"guest"}).save((err)=>{
            if(err){
                console.log("error",err)
            }
            console.log("Guest Collection Has Been Created")
        })
      }
      else{
        console.log("Collection Has Been Already Created")
      }
  })
}
exports.makeRefreshCollection =()=>{
  RefreshToken.collection.estimatedDocumentCount((err,count)=>{
    if(!err && count === 0){
      new RefreshToken({token:null,expiryDate:null,userId:null}).save()
    }

  })

}
