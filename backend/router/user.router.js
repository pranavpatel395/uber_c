//user.router.js 

const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const userController = require('../controllers/user.controller.js')
const authMiddeleware= require('../middleware/user.middleware.js')


router.post('/register', [
  body('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required"),
  body('fullname.firstname').isLength({ min: 3 }).withMessage("First name must be at least 3 characters long").notEmpty().withMessage("First name is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").notEmpty().withMessage("Password is required"),
], userController.registerUser);

router.post('/login',[
  body('email').isEmail().withMessage("Invalid Email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")

],
userController.loginUser)

router.get('/profile', authMiddeleware.userAuth ,userController.userProfile)


module.exports = router