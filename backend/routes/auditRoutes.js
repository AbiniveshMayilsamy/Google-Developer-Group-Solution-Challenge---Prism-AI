const express = require('express');
const Audit = require('../models/Audit');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/save', protect, async (req, res) => {
  try {
    const { datasetName, targetAttribute, sensitiveAttribute, metrics, status } = req.body;
    if (metrics?.statisticalParityDifference !== undefined && metrics?.statisticalParity === undefined) {
      metrics.statisticalParity = metrics.statisticalParityDifference;
    }
    const audit = await new Audit({ user: req.user._id, datasetName, targetAttribute, sensitiveAttribute, metrics, status }).save();
    res.status(201).json(audit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(audits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
