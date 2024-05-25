const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  let token = req.headers['authorization'];
  
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1]; // Split the header and get the token part
  } else {
    // Handle the case where the header is missing or does not start with 'Bearer '
    token = null; // Or throw an error or take other appropriate actions
  }

  if (!token) {
    return res.status(403).json({
      error: true,
      message: 'No token provided.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: 'Failed to authenticate token.'
      });
    }

    const user = await userModel.checkUser(decoded.email);

    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'User not found.'
      });
    }

    // set userInfo
    req.userInfo = {
      user_id: user.user_id,
      email: user.email
    };

    next();
  });
}

module.exports = {
  verifyToken
};