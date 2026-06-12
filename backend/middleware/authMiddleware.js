const jwt = require('jsonwebtoken');
const { User } = require('../services/db');
const SECRET = process.env.JWT_SECRET || 'prism_secret_fallback';

const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], SECRET);
    let userObj = await User.findByPk(decoded.id);
    
    if (!userObj) {
      // Fallback: Check MongoDB standby for active session
      const MongoUser = require('../models/User');
      const mongoUser = await MongoUser.findById(decoded.id);
      if (mongoUser) {
        // Auto-heal: Import MongoDB user to SQL primary
        userObj = await User.create({
          id: mongoUser.sqlId || mongoUser._id.toString(),
          name: mongoUser.name,
          email: mongoUser.email,
          password: mongoUser.password,
          googleId: mongoUser.googleId,
          role: mongoUser.role === 'admin' ? 'org_admin' : mongoUser.role,
          status: mongoUser.status || 'active'
        });
        console.log(`💡 Auto-healed session: Imported user ${userObj.email} from Mongo to SQL Primary.`);
      }
    }

    if (!userObj) return res.status(401).json({ message: 'User not found' });
    
    req.user = userObj;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Legacy admin check (includes Super and Org admins)
const admin = (req, res, next) => {
  if (['super_admin', 'org_admin', 'admin'].includes(req.user?.role)) {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

const superAdmin = (req, res, next) => {
  if (req.user?.role === 'super_admin') {
    return next();
  }
  res.status(403).json({ message: 'Super Admin access required' });
};

const orgAdmin = (req, res, next) => {
  if (['super_admin', 'org_admin'].includes(req.user?.role)) {
    return next();
  }
  res.status(403).json({ message: 'Organization Admin access required' });
};

const groupAdmin = (req, res, next) => {
  if (['super_admin', 'org_admin', 'group_admin'].includes(req.user?.role)) {
    return next();
  }
  res.status(403).json({ message: 'Group Admin access required' });
};

module.exports = { 
  protect, 
  admin, 
  superAdmin, 
  orgAdmin, 
  groupAdmin 
};
