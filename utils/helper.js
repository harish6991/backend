require('dotenv').config({path:'../config/.env'});
const nodemailer = require("nodemailer");
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const user = process.env.EMAIL_HOST_USER;
const pass = process.env.EMAIL_HOST_PASSWORD;

// from Access Token Creating The Refresh token
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.EMAIL_REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: user,
      accessToken,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN
    }
  });

  return transporter;
};


const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};


module.exports = {
    createSlug:function(Text){
       return Text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')
    },
    sendConfrimationEmail:async function(name,email,confirmationCode){
      await sendEmail({
        from:user,
        to:email,
        subject:"Please Confirm Your Account",
        html:`<h1>Email Confirmation</h1>
              <h2>Hello ${name}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=http://localhost:9000/api/auth/confirm/${confirmationCode}> Click here</a>
              `
      })
    },
    passwordResetting:async function(name,email,confirmationCode){
      await sendEmail({
        from:user,
        to:email,
        subject:"Reset Your Password",
        html:`<h1>Reset Your Password</h1>
              <h2>Hello ${name}</h2>
              <p>Please Click On the Link Below To Reset Your Password</p>
              <a href="http://localhost:3000/#/reset/:${confirmationCode}">Click Here</a>
          `
      })
    }

}
//  Email Sending Services;
