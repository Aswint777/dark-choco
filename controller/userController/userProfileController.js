const User = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userProfile = async (req, res) => {
  const token = req.cookies.loginToken;
  const data = jwt.verify(token, process.env.SECRET_KEY);
  const { userId } = data;
  const profile = await User.findOne({ _id: userId });
  console.log(profile, "lllllllllllllllllll");
  res.render("userViews/userProfilePage", { profile });
};

const userProfilePost = async (req, res) => {
  try {
    console.log("edited .....................");
    console.log(req.body);

    const {
      firstName,
      secondName,
      email,
      phoneNumber,
      address,
      pinNumber,
      OldPassword,
      newPassword,
    } = req.body;
    let pass;
    let auth;
    if (OldPassword.length > 1) {
      pass = await User.findOne({ email: email });
      if (pass) {
        console.log(pass);
        console.log(OldPassword);
        auth = await bcrypt.compare(OldPassword, pass.password);
        if (!auth) {
          throw Error("current password is wrong");
        }
      }
      console.log(auth, "tttttttttttttttttttttttttttiiiiiiiiiiiii");
    }
    if (newPassword.length > 0 && OldPassword.length < 1) {
      console.log("reppoooo");
      throw Error("Enter the current password");
    }

    if (!pass || auth) {
      console.log(newPassword, "llll");

      const salt = await bcrypt.genSalt();
      const NewPassword = await bcrypt.hash(newPassword, salt);

      const obj = {
        firstName: firstName,
        secondName: secondName,
        phoneNumber: phoneNumber,
        address: address,
        pinNumber: pinNumber,
        password: NewPassword,
      };

      const data = await User.findOneAndUpdate(
        { email: email },
        { $set: obj },
        { upsert: true, new: true }
      );
      console.log(data);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  userProfile,
  userProfilePost,
};
