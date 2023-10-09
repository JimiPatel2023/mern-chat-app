const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      throw new Error("No Database connection String found");
    }
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log("connected to database");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
