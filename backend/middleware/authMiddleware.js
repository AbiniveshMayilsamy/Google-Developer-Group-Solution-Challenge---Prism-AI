const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = process.env.JWT_SECRET || 'prism_secret_fallback';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in .env — using insecure fallback. Set JWT_SECRET before deploying to production.');
}

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Any admin role
const admin = (req, res, next) => {
  const adminRoles = ['admin', 'super_admin', 'org_admin'];
  if (req.user && adminRoles.includes(req.user.role)) return next();
  res.status(403).json({ message: 'Admin access required' });
};

// Super admin only
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') return next();
  res.status(403).json({ message: 'Super admin access required' });
};

// Org admin or above
const orgAdmin = (req, res, next) => {
  const allowed = ['admin', 'super_admin', 'org_admin'];
  if (req.user && allowed.includes(req.user.role)) return next();
  res.status(403).json({ message: 'Org admin access required' });
};

module.exports = { protect, admin, superAdmin, orgAdmin };
