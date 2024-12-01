const mongoose = require('mongoose')

const jwtBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the time of blacklisting
    expires:86400 //24 hours in second
  },
})

module.exports = mongoose.model('blackListToken', jwtBlacklistSchema)