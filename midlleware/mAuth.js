const jwt = require('jsonwebtoken');
const usersList = require('../users.json');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const manager = usersList.find((mgr) => mgr.id === decoded.id);

    if (!manager) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = manager;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
