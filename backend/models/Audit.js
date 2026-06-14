const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  sqlId: {
    type: String,
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // make optional during cross-database seeding/replication
  },
  userSqlId: {
    type: String,
    required: false
  },
  datasetName: {
    type: String,
    required: true,
    default: 'Unknown Dataset',
  },
  targetAttribute: {
    type: String,
    required: true,
  },
  sensitiveAttribute: {
    type: String,
    required: true,
  },
  metrics: {
    disparateImpact: { type: Number, required: true, default: 0 },
    statisticalParity: { type: Number, required: true, default: 0 },
    statisticalParityDifference: { type: Number, default: null }, // alias — same value as statisticalParity
    equalOpportunity: { type: Number, default: 1.0 },
  },
  status: {
    type: String,
    enum: ['Fair', 'Biased'],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
