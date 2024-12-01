const userModel = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const jwtBlacklistModel = require('../models/blacklistToken.model.js'); // Use correct blacklist model

module.exports.userAuth = async (req, res, next) => {
  try {
    // Retrieve token from cookies or authorization header
    const token =
      req.cookies?.token || 
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await jwtBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach user to request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
