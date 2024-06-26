const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

async function aboutToken(req, res, next) {
  const token = req.cookies.loginToken;
  try {
    console.log('about page is here');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const { userId } = decoded;

    if (!userId) {
      res.render("userViews/about", { userAuth: false });
      return;
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.render("userViews/about", { userAuth: false });
    return;
  }

  next();
}

module.exports = aboutToken;
