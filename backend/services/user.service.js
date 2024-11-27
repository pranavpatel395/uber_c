// user.service.js

const userModel = require('../models/user.model.js')

module.exports.createUser = async ({ firstname, lastname, email, password }) => {
  if (!firstname || !email || !password) {
    throw new Error("all field are requires");

  }
  const user = userModel.create({
    fullname: {
       firstname,
       lastname,
     },
       email,
       password
  })
  return user
}
