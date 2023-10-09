const jwt = require("jsonwebtoken");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "3d" });
};

module.exports = generateToken;
