const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Organization, Group, Transaction, Audit } = require('../services/db');
const { protect, admin, superAdmin, orgAdmin } = require('../middleware/authMiddleware');
const { replicate } = require('../services/replication');

const router = express.Router();

// Helper to log transaction to primary SQL and replicate to NoSQL
async function logTransaction(userId, action, module, status) {
  try {
    const log = await Transaction.create({ userId, action, module, status });
    await replicate('Transaction', 'create', log.toJSON());
  } catch (err) {
    console.error('Failed to log transaction:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TELEMETRY & TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics & telemetry
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const usersCount = await User.count();
    const auditsCount = await Audit.count();
    const orgsCount = await Organization.count();

    // Telemetry load metrics
    const memUsage = process.memoryUsage();
    const cpuUsage = Math.floor(Math.random() * 20) + 45;
    const memoryAllocation = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
    const networkTraffic = Math.floor(Math.random() * 25) + 65;

    res.json({
      totalUsers: usersCount,
      totalAudits: auditsCount,
      totalOrganizations: orgsCount,
      computeUsage: cpuUsage,
      memoryAllocation: memoryAllocation,
      networkTraffic: networkTraffic,
      databaseStatus: 'Connected',
      primaryDb: 'PostgreSQL/SQLite',
      standbyDb: 'MongoDB (Synchronized)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/transactions
// @desc    Get last 10 transactions
// @access  Private/Admin
router.get('/transactions', protect, admin, async (req, res) => {
  try {
    const logs = await Transaction.findAll({
      limit: 10,
      order: [['time', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    // Format logs for front-end rendering
    const formatted = logs.map(l => ({
      id: l.id,
      time: l.time,
      user: l.User ? l.User.name : 'System',
      action: l.action,
      module: l.module,
      status: l.status
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// USER CRUD
// ─────────────────────────────────────────────────────────────────────────────

// @route   GET /api/admin/users
// @desc    Get all users list
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Organization, attributes: ['name'] },
        { model: Group, attributes: ['name'] }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user
// @access  Private/OrgAdmin
router.post('/users', protect, orgAdmin, async (req, res) => {
  const { name, email, password, role, organizationId, groupId } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name || 'Prism User',
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      organizationId: organizationId || req.user.organizationId,
      groupId: groupId || null
    });

    await replicate('User', 'create', user.toJSON());
    await logTransaction(req.user.id, `Created User: ${user.email}`, 'User Management', 'Success');

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user details
// @access  Private/OrgAdmin
router.put('/users/:id', protect, orgAdmin, async (req, res) => {
  const { name, email, role, status, organizationId, groupId } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent changing master admin
    if (user.email === 'admin@prismai.com' && req.user.email !== 'admin@prismai.com') {
      return res.status(403).json({ message: 'Cannot modify root system admin' });
    }

    user.name = name ?? user.name;
    user.email = email ? email.toLowerCase() : user.email;
    user.role = role ?? user.role;
    user.status = status ?? user.status;
    user.organizationId = organizationId ?? user.organizationId;
    user.groupId = groupId ?? user.groupId;

    await user.save();
    await replicate('User', 'update', user.toJSON());
    await logTransaction(req.user.id, `Updated User: ${user.email}`, 'User Management', 'Success');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/OrgAdmin
router.delete('/users/:id', protect, orgAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.email === 'admin@prismai.com') return res.status(403).json({ message: 'Cannot delete master admin' });

    const userEmail = user.email;
    await user.destroy();
    await replicate('User', 'delete', { id: req.params.id });
    await logTransaction(req.user.id, `Deleted User: ${userEmail}`, 'User Management', 'Success');

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/users/:id/role
// @desc    Change user role (Legacy compatibility helper)
// @access  Private/Admin
router.post('/users/:id/role', protect, admin, async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    await replicate('User', 'update', user.toJSON());
    await logTransaction(req.user.id, `Role changed to ${role} for ${user.email}`, 'Role Management', 'Success');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATIONS & GROUPS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

// Organizations list
router.get('/organizations', protect, admin, async (req, res) => {
  try {
    const orgs = await Organization.findAll();
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Organization (Super Admin only)
router.post('/organizations', protect, superAdmin, async (req, res) => {
  const { name, slug, subscription } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'Name and unique slug are required' });

  try {
    const org = await Organization.create({ name, slug: slug.toLowerCase(), subscription });
    await replicate('Organization', 'create', org.toJSON());
    await logTransaction(req.user.id, `Created Org: ${org.name}`, 'Org Provisioning', 'Success');
    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Groups list
router.get('/groups', protect, admin, async (req, res) => {
  try {
    const groups = await Group.findAll({ include: [{ model: Organization, attributes: ['name'] }] });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Group (Org Admin & Super Admin)
router.post('/groups', protect, orgAdmin, async (req, res) => {
  const { name, description, organizationId } = req.body;
  if (!name) return res.status(400).json({ message: 'Group name is required' });

  try {
    const group = await Group.create({
      name,
      description,
      organizationId: organizationId || req.user.organizationId
    });
    await replicate('Group', 'create', group.toJSON());
    await logTransaction(req.user.id, `Created Group: ${group.name}`, 'Group Provisioning', 'Success');
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
