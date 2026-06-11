require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.use('/api',        require('./routes/api'));
app.use('/api/chat',   require('./routes/chat'));
app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/audits', require('./routes/auditRoutes'));

try {
  app.use('/api/admin', require('./routes/adminRoutes'));
} catch (e) { /* optional route */ }

// ── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── Connect MongoDB ───────────────────────────────────────────────
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set in .env — see .env.example');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('   Make sure MongoDB is running and MONGO_URI is correct in .env');
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
