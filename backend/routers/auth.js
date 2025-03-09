const mongoose = require("mongoose");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser")
const { User: User } = require("../models/index")

const authRouter = express.Router()
authRouter.use(express.json())
authRouter.use(cookieparser())

authRouter.post("/signup", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const userRet = await User.findOne({ email });
    if (userRet) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const passwordEnc = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName: userName,
      email: email,
      password: passwordEnc
    });
    if (user) {
      const token = jsonwebtoken.sign({ userName: userName, email: email }, process.env.JWTSECRET, { expiresIn: '3h' });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 3600000
      });
      console.log("User sign-up sucessful")
      return res.status(200).json({
        message: "Login successful",
        userName: user.userName,
        email: user.email,
        token
      });
    } else {
      console.log("Invalid User Details");
    }
  } catch (error) {
    console.log(error)
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ message: "User not Found" });
    }
    const comparePass = await bcrypt.compare(password, userExists.password);
    if (!comparePass) {
      return res.status(400).json({ message: "Wrong password" });
    }
    
    const token = await jsonwebtoken.sign(
      { userName: userExists.userName, email: userExists.email },
      process.env.JWTSECRET,
      { expiresIn: "3h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 7 * 24 * 3600000
    });

    console.log("User login successful");
    
    return res.status(200).json({
      message: "Login successful",
      userName: userExists.userName,
      email: userExists.email,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});


authRouter.post("/logout", (req, res) => {
  res.cookie("token", "", { 
    httpOnly: true, 
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", 
    sameSite: "Strict" 
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = authRouter;