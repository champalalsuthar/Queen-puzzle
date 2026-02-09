const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config()

const URL = process.env.MONGO_URL
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
