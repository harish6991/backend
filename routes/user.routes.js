const express = require("express");
const userController = require("../controller/user.controller");
const verifySignUp = require('../middleware/verifySignUp');
const authJwt = require("../middleware/authJwt");
const userRoutes = express.Router();
userRoutes.use(function(req,res,next){
  res.header(
      "Access-Control-Allow-Headers",
      "x-acess-token,Origin,Content-Type,Accept"
  )
  next();
})

userRoutes.post('/signUp',[verifySignUp.checkDuplicateNameOrEmail,verifySignUp.checkRoleExisted],userController.signUp);
userRoutes.post('/signIn',userController.signIn);
userRoutes.post('/refresh',userController.refreshToken);
userRoutes.get('/guest',[authJwt.verifyToken,authJwt.isGuest],userController.guestAccess);
userRoutes.get("/admin",[authJwt.verifyToken,authJwt.isAdmin],userController.adminAccess);
userRoutes.get("/user",[authJwt.verifyToken,authJwt.isUser],userController.userAccess);
userRoutes.get("/all",userController.gettingTheUsers);
userRoutes.get("/confirm/:confirmationCode",userController.verifyUser);
userRoutes.post("/passwordReset",userController.resetPassword);
userRoutes.post('/passwordUpdate',userController.updatePassword);

module.exports = userRoutes;
