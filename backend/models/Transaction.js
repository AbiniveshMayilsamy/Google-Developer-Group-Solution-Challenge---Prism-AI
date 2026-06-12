const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sqlId: { type: String, required: false }, // Map to Sequelize UUID
  time: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userSqlId: { type: String, required: false },
  action: { type: String, required: true },
  module: { type: String, required: true },
  status: { type: String, default: 'Success' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
