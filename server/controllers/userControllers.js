const User = require("../models/userModel");
const validator = require("validator");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "please fill all the fields" });
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Please Enter a valid email" });
    user = await User.create({
      name,
      email,
      password,
    });
    const token = generateToken(user._id);
    res
      .status(200)
      .json({ _id: user._id, name: user.name, token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "please fill email and password" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const token = generateToken(user._id);
    res
      .status(200)
      .json({ _id: user._id, name: user.name, token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "No user found with this id" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
