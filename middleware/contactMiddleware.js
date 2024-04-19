const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

async function contactToken(req, res, next) {
  const token = req.cookies.loginToken;
  try {
    console.log('contact page');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const { userId } = decoded;

    console.log(userId,'dfhdfhj');
    if (!userId) {
      res.render("userViews/contact", { userAuth: false });
      return;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.render("userViews/contact", { userAuth: false });
    return;
  }

  next();
}

module.exports = contactToken
