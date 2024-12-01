// user.controller.js


const { model } = require("mongoose")
const userModel = require("../models/user.model.js")
const userService = require('../services/user.service.js')
const blackListTokenModel = require('../models/blacklistToken.model.js')
const {validationResult} = require('express-validator')

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const hashPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
    });

    const token = user.generateAutToken();
    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async(req, res, next)=>{
  const errors = validationResult(req)


  if(!errors.isEmpty()){
    return res.status(401).json({errors:errors.array()})
  }

  const{ email,password} = req.body

  const user = await userModel.findOne({email}).select("+password")

  if(!user){
    return res.status(401).json({message:"Invalide Email and Password"})
  }

  const isMatch = await user.comparePassword(password)
  if(!isMatch){
    return res.status(401).json({message:"Invalide Email and Password"})
  }

  const token = user.generateAutToken()

  res.cookie('token', token)
  return res.status(200).json({token, user})
}

module.exports.userProfile = async(req,res,next)=>{
  res.status(200).json(req.user)
}

module.exports.userLogout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');

    // Retrieve token from cookies or headers
    const token = req.cookies?.token || 
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token) {
      // Add the token to the blacklist
      await blackListTokenModel.create({ token });
    }

    // Send the logout response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
