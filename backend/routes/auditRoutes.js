const express = require('express');
const Audit = require('../models/Audit');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/audits/save
// @desc    Save a new audit result
router.post('/save', protect, async (req, res) => {
  try {
    const { datasetName, targetAttribute, sensitiveAttribute, metrics, status } = req.body;

    const audit = new Audit({
      user: req.user._id,
      datasetName,
      targetAttribute,
      sensitiveAttribute,
      metrics,
      status
    });

    const savedAudit = await audit.save();
    res.status(201).json(savedAudit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/audits/history
// @desc    Get all audits for logged in user
router.get('/history', protect, async (req, res) => {
  try {
    const audits = await Audit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
