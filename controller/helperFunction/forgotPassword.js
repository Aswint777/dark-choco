const transporter = require("../../services/nodemailer");
const restPassword = require("../../model/forgotPasswordModel");
require("dotenv").config();
const otpGenerator = require("otp-generator");

module.exports = async function forgotPassword(email) {
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
  console.log(otpCreater);
  const otpSave = await restPassword.create({ otp: otpCreater, email });
};
