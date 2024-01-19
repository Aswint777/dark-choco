const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("working");
  })
  .catch((err) => {
    console.log("error", err);
  });
module.exports = mongoose;
