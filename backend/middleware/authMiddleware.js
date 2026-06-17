const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to req
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system databases' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Access denied: invalid token credentials' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Access denied: authorization token missing' });
  }
};

module.exports = { protect };
