const express = require('express');
const Audit = require('../models/Audit');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/audits/save
router.post('/save', protect, async (req, res) => {
  try {
    const { datasetName, targetAttribute, sensitiveAttribute, status } = req.body;
    const rawMetrics = req.body.metrics || {};

    // Normalize: accept either statisticalParityDifference or statisticalParity
    const normalizedMetrics = {
      ...rawMetrics,
      statisticalParity:
        rawMetrics.statisticalParity !== undefined
          ? rawMetrics.statisticalParity
          : rawMetrics.statisticalParityDifference !== undefined
          ? rawMetrics.statisticalParityDifference
          : 0,
    };

    const audit = await new Audit({
      user: req.user._id,
      datasetName: datasetName || 'Uploaded Dataset',
      targetAttribute,
      sensitiveAttribute,
      metrics: normalizedMetrics,
      status,
    }).save();

    res.status(201).json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/audits/history
router.get('/history', protect, async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
