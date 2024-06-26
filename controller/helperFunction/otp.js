const userOtpVarification = require("../../services/nodemailer");
const transporter = require("../../services/nodemailer");
const otp = require("../../model/otpModel");
require("dotenv").config();
const otpGenerator = require("otp-generator");

async function main(email, firstName, secondName, password,referralCode) {
  let otpCreater;
  const otpGenerates = () => {
    otpCreater = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log(otpCreater, "its first otp");
    return otpCreater;
  };
  otpGenerates();

  let Message = {
    from: process.env.USER_EMAIL, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    // text: otpCreater,/
    text: otpCreater, // plain text body
    html: "<b>Hello world?</b>", // html body 
    html: otpCreater, // html body
  };
  // send mail with defined transport object
  const info = transporter.sendMail(Message, (error, info) => {
    if (error) {
      console.log("Eror sending mail");     
      console.log(error);
      // res.send('Err '+error)
      return;
    }
    console.log("Email send succesfully ", info.response);
  });
  let userReferralCode;
  const referralCodeGenerates = () => {
    userReferralCode = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: true,
      lowerCaseAlphabets: true,
    });
    console.log(userReferralCode, "its first otp");
    return userReferralCode;
  };
  referralCodeGenerates();
  console.log(userReferralCode,'userReferralCode');
  const otpSave = await otp.create({
    otp: otpCreater,
    email,
    firstName,
    secondName,
    password,
    userReferralCode : userReferralCode,
    referredId : referralCode
  });
  console.log(otpSave, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
}

module.exports = { main };
