const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

async function aboutToken(req, res, next) {
  const token = req.cookies.loginToken;

  console.log(token, "   9898-. ,");

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Extract the userId from the decoded token
    const { userId } = decoded;

    // If the userId is not present, the user is not logged in
    if (!userId) {
      res.render("userViews/about", { userAuth: false });
      return;
    }
  } catch (error) {
    // Handle invalid token or other errors
    console.error("Error verifying token:", error);
    res.render("userViews/about", { userAuth: false });
    return;
  }

  // If the token is valid and the userId is present, continue to the next middleware
  next();
}

module.exports = aboutToken;
