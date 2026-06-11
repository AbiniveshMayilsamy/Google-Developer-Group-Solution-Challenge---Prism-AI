require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api',        require('./routes/api'));
app.use('/api/chat',   require('./routes/chat'));
app.use('/api/auth',   require('./routes/authRoutes'));
app.use('/api/audits', require('./routes/auditRoutes'));

try { app.use('/api/admin', require('./routes/adminRoutes')); } catch (e) {}

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: 'db' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('👉 Run: net start MongoDB   (as Administrator)');
    process.exit(1);
  });
