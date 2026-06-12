const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  sqlId: { type: String, required: false }, // Map to Sequelize UUID
  name: { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false },
  organizationSqlId: { type: String, required: false },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
