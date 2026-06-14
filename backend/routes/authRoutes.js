const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'prism_secret_fallback';
const makeToken = (id) => jwt.sign({ id }, SECRET, { expiresIn: '30d' });

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in .env — using insecure fallback. Set JWT_SECRET before deploying to production.');
}

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  try {
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name: name || 'Prism User', email: email.toLowerCase(), password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: makeToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    if (!user.password) return res.status(401).json({ message: 'This account uses Google Sign-In.' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: makeToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GOOGLE OAUTH
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'No Google credential provided' });
  try {
    // Verify the Google ID token signature using google-auth-library
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;
    if (!email) return res.status(400).json({ message: 'Could not read email from Google token' });
    const emailLower = email.toLowerCase();
    let user = await User.findOne({ email: emailLower });
    if (!user) {
      user = await User.create({ name: name || emailLower, email: emailLower, password: crypto.randomBytes(20).toString('hex'), googleId });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: makeToken(user._id) });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// CHANGE PASSWORD
router.post('/change-password', require('../middleware/authMiddleware').protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords are required' });
  if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
  try {
    const user = await User.findById(req.user._id);
    if (!user.password) return res.status(400).json({ message: 'This account uses Google Sign-In' });
    const match = await user.matchPassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
