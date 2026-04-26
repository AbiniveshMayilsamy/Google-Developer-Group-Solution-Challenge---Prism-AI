const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    disparateImpact: { type: Number, required: true },
    statisticalParity: { type: Number, required: true },
    equalOpportunity: { type: Number, default: 1.0 },
  },
  status: {
    type: String,
    enum: ['Fair', 'Biased'],
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Audit', auditSchema);
