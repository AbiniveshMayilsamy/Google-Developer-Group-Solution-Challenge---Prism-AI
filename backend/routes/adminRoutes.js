const express = require('express');
const User = require('../models/User');
const Audit = require('../models/Audit');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments();
    const totalAudits = await Audit.countDocuments();
    const mem = process.memoryUsage();
    res.json({
      totalUsers,
      totalAudits,
      totalOrganizations: 0,
      computeUsage:       Math.floor(Math.random() * 20) + 45,
      memoryAllocation:   Math.round((mem.heapUsed / mem.heapTotal) * 100),
      networkTraffic:     Math.floor(Math.random() * 25) + 65,
      databaseStatus:     'Connected',
      primaryDb:          'MongoDB',
      standbyDb:          'MongoDB Atlas'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users
router.post('/users', protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name: name || 'Prism User', email, password, role: role || 'user' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email === 'admin@prismai.com' && req.user.email !== 'admin@prismai.com') {
      return res.status(403).json({ message: 'Cannot modify root admin' });
    }
    const { name, role, status } = req.body;
    if (name)   user.name   = name;
    if (role)   user.role   = role;
    if (status) user.status = status;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email === 'admin@prismai.com') return res.status(403).json({ message: 'Cannot delete root admin' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/transactions — returns recent audits as transaction log
router.get('/transactions', protect, admin, async (req, res) => {
  try {
    const audits = await Audit.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email');
    const formatted = audits.map(a => ({
      id:     a._id,
      time:   a.createdAt,
      user:   a.user?.name || 'Unknown',
      action: `Bias Audit — DI: ${a.metrics?.disparateImpact?.toFixed(3)}`,
      module: a.targetAttribute || 'Analysis',
      status: a.status === 'Fair' ? 'Success' : 'Alert'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/organizations — stub (not used with MongoDB simple mode)
router.get('/organizations', protect, admin, (req, res) => res.json([]));

// GET /api/admin/groups — stub
router.get('/groups', protect, admin, (req, res) => res.json([]));

module.exports = router;
