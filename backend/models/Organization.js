const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  sqlId: { type: String, required: false }, // Map to Sequelize UUID
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subscription: { type: String, enum: ['free', 'enterprise'], default: 'free' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
