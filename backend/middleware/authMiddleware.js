const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = process.env.JWT_SECRET || 'prism_secret_fallback';

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Not authorized — user not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — token is invalid or expired' });
  }
};

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, admin };
