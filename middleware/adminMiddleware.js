const jwt = require("jsonwebtoken");

const adminAuthenticateToken = (req, res, next) => {
  const token = req.cookies.adminLoginToken;
  console.log(token, " ----------------------------------");
  if (!token) {
    return res.redirect("/adminLogin");
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.log("issue");
      res.redirect("/adminLogin");
    }

    req.user = user;
    next();
  });
};

module.exports = adminAuthenticateToken;
