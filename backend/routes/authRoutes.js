const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, Organization, Group, Transaction } = require('../services/db');
const { replicate } = require('../services/replication');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'prism_secret_fallback';
const makeToken = (id) => jwt.sign({ id }, SECRET, { expiresIn: '30d' });

// Helper to log transaction to primary SQL and replicate to NoSQL
async function logTransaction(userId, action, module, status) {
  try {
    const log = await Transaction.create({ userId, action, module, status });
    await replicate('Transaction', 'create', log.toJSON());
  } catch (err) {
    console.error('Failed to log transaction:', err.message);
  }
}

// Helper to handle corporate domain workspace auto-provisioning
async function getOrCreateWorkspaceForEmail(email) {
  const domain = email.split('@')[1];
  const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'icloud.com'];
  
  if (publicDomains.includes(domain.toLowerCase())) {
    // Default organization for individual users
    let defaultOrg = await Organization.findOne({ where: { slug: 'prism-retail' } });
    if (!defaultOrg) {
      defaultOrg = await Organization.create({
        name: 'Prism Public Space',
        slug: 'prism-retail',
        subscription: 'free'
      });
      await replicate('Organization', 'create', defaultOrg.toJSON());
    }
    return defaultOrg;
  }

  // Corporate domain - create organization slugged after the domain name
  const companyName = domain.split('.')[0].toUpperCase() + ' Corp';
  const slug = domain.split('.')[0].toLowerCase();
  
  let companyOrg = await Organization.findOne({ where: { slug } });
  if (!companyOrg) {
    companyOrg = await Organization.create({
      name: companyName,
      slug,
      subscription: 'enterprise'
    });
    await replicate('Organization', 'create', companyOrg.toJSON());

    // Auto-create a default group for the new organization
    const defaultGroup = await Group.create({
      name: 'General Compliance Team',
      description: 'Default compliance and auditing squad',
      organizationId: companyOrg.id
    });
    await replicate('Group', 'create', defaultGroup.toJSON());
  }

  return companyOrg;
}

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  
  try {
    const emailLower = email.toLowerCase();
    const existing = await User.findOne({ where: { email: emailLower } });
    if (existing) return res.status(400).json({ message: 'An account with this email already exists' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-provision organization / workspace
    const org = await getOrCreateWorkspaceForEmail(emailLower);
    
    // Create SQL user
    const user = await User.create({
      name: name || 'Prism User',
      email: emailLower,
      password: hashedPassword,
      role: 'user', // Defaults to user role
      organizationId: org.id
    });

    // Replicate User to Mongo
    await replicate('User', 'create', user.toJSON());

    // Log action
    await logTransaction(user.id, 'User Registered', 'Auth', 'Success');

    res.status(201).json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: makeToken(user.id) 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  
  try {
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ where: { email: emailLower } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.password) return res.status(401).json({ message: 'This account uses Google Sign-In.' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    
    // Log action
    await logTransaction(user.id, 'User Logged In', 'Auth', 'Success');

    res.json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: makeToken(user.id) 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GOOGLE OAUTH & ONE TAP
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No Google credential provided' });
  
  try {
    // Decode JWT from Google credential
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64url').toString());
    const { sub: googleId, email, name } = payload;
    if (!email) return res.status(400).json({ message: 'Could not read email from Google token' });
    
    const emailLower = email.toLowerCase();
    let user = await User.findOne({ where: { email: emailLower } });
    const org = await getOrCreateWorkspaceForEmail(emailLower);

    if (!user) {
      // Create user
      user = await User.create({
        name: name || emailLower,
        email: emailLower,
        googleId,
        role: 'user',
        organizationId: org.id
      });
      await replicate('User', 'create', user.toJSON());
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
      await replicate('User', 'update', user.toJSON());
    }
    
    // Log action
    await logTransaction(user.id, 'Google OAuth Logged In', 'Auth', 'Success');

    res.json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: makeToken(user.id) 
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

module.exports = router;
