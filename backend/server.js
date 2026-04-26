require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/authRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/audits', auditRoutes);

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB (with Mock Bypass)
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('⚠️ No MONGO_URI found. Running in MOCK MODE (No Database).');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('❌ MongoDB Connection Error: ', err.message);
    console.log('⚠️ Falling back to MOCK MODE.');
  }
};
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
