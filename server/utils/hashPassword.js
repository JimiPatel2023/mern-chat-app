const bcrypt = require("bcrypt");

const hashPassword = async (enteredPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(enteredPassword, salt);
  return hashedPassword;
};

module.exports = hashPassword;
