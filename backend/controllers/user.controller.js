// user.controller.js


const { model } = require("mongoose")
const userModel = require("../models/user.model.js")
const userService = require('../services/user.service.js')
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
  return res.status(200).json({token, user})
}

module.exports.userProfile = async(req,res,next)=>{
  res.status(200).json(req.user)
}