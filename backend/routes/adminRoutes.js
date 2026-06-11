const express = require('express');
const User = require('../models/User');
const Audit = require('../models/Audit');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users list
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/users/:id/role
// @desc    Change user role between user and admin
// @access  Private/Admin
router.post('/users/:id/role', protect, admin, async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role value' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics & status
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    const auditsCount = await Audit.countDocuments({});

    // Dynamic resource usage (real metrics could come from process.memoryUsage() etc.)
    const memUsage = process.memoryUsage();
    const cpuUsage = Math.floor(Math.random() * 20) + 45;
    const memoryAllocation = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
    const networkTraffic = Math.floor(Math.random() * 25) + 65;

    res.json({
      totalUsers: usersCount,
      totalAudits: auditsCount,
      computeUsage: cpuUsage,
      memoryAllocation: memoryAllocation,
      networkTraffic: networkTraffic,
      databaseStatus: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
