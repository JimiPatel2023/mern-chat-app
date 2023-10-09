const mongoose = require("mongoose");
const hashPassword = require("../utils/hashPassword");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 200,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 1024,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const hashedPassword = await hashPassword(this.password);
  console.log(hashedPassword);
  this.password = hashedPassword;
  next();
});

userSchema.methods.verifyPassword = async function (enteredPassword) {
  const isValid = await bcrypt.compare(enteredPassword, this.password);
  return isValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
