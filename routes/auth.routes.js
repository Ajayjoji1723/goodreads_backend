const express = require("express");
const _ = require("underscore");
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

    const userData = {
      name,
      email,
      mobile: ipData.mobile || "",
      password,
      age: ipData.age || 0,
      gender: ipData.gender || "",
    };

    const newUser = await User.insertOne(userData);
    response.data = newUser;
  } catch (err) {
    console.log("/auth/register: ", err);
    response.success = 0;
    response.message = err.message;
  }

  res.status(statusCode).json(response);
});

module.exports = router;
