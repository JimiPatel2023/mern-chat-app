const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:id", findUser);
router.get("/", getUsers);

module.exports = router;
