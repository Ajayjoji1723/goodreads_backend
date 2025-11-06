const express = require("express");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtAuth = require("../middleware/jwt.service");
const User = require("../model/User");

const router = express.Router();

//Register API
router.post("/register", async (req, res) => {
  let response = { success: 1, message: "User Added Successfully." };
  let statusCode = 200;
  try {
    const ipData = req.body;
    if (_.size(ipData) == 0) throw new Error("Input body is required");

    const { name, email, password } = ipData;
    if (!name || !email || !password)
      throw new Error("name , email, password are required");
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^a-zA-Zds]).{8,15}$/;

    if (passRegex.test(password))
      throw new Error(
        "Password required with one upper, lower, number, speacila char min 8 , max 15"
      );

    //check the user already exist
    const isExist = await User.findOne({ email: email });

    if (isExist) throw new Error("User Already Exist with this email");
    const hashedPass = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      mobile: ipData.mobile || "",
      password: hashedPass,
      age: ipData.age || 0,
      gender: ipData.gender || "",
    };

    const newUser = await User.insertOne(userData);
    // response.data = newUser;
  } catch (err) {
    console.log("/auth/register: ", err);
    response.success = 0;
    response.message = err.message;
  }

  res.status(statusCode).json(response);
});

router.post("/login", async (req, res) => {
  let response = { success: 1, message: "Login Successfully." };
  let statusCode = 200;
  try {
    const ipData = req.body;
    if (_.size(ipData) == 0) throw new Error("Input body is required");

    const { email, password } = ipData;
    if (!email || !password) throw new Error(" email, password are required");

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^a-zA-Zds]).{8,15}$/;
    if (passRegex.test(password))
      throw new Error(
        "Password required with one upper, lower, number, speacila char min 8 , max 15"
      );

    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Email");

    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) throw new Error("Invalid password");

    //create a token
    const payload = {
      user_id: user._id,
      name: user.name,
    };

    const access_token = jwt.sign(payload, "JWT_SECRETE_KEY", {
      expiresIn: "1h",
    });

    response.data = { token: access_token };
  } catch (err) {
    console.log("/auth/login: ", err);
    response.success = 0;
    response.message = err.message;
  }

  res.status(statusCode).json(response);
});

router.get("/user-profile", jwtAuth, async (req, res) => {
  let response = { success: 1, message: "User Info Successfully." };
  let statusCode = 200;
  try {
    const userdata = req.userData;
    const user = await User.findOne({ _id: userdata.user_id });

    const userProfile = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      age: user.gender,
    };
    response.data = userProfile;
  } catch (err) {
    console.log("/auth/login: ", err);
    response.success = 0;
    response.message = err.message;
  }

  res.status(statusCode).json(response);
});

module.exports = router;
