const express = require('express');
const { Audit } = require('../services/db');
const { protect } = require('../middleware/authMiddleware');
const { replicate } = require('../services/replication');
const router = express.Router();

// Save audit (SQL Primary -> NoSQL standby)
router.post('/save', protect, async (req, res) => {
  try {
    const { datasetName, targetAttribute, sensitiveAttribute, metrics, status } = req.body;
    
    const spd = metrics.statisticalParityDifference !== undefined 
      ? metrics.statisticalParityDifference 
      : (metrics.statisticalParity !== undefined ? metrics.statisticalParity : 0);

    const audit = await Audit.create({
      userId: req.user.id,
      datasetName: datasetName || 'Uploaded Dataset',
      targetAttribute,
      sensitiveAttribute,
      disparateImpact: metrics.disparateImpact || 0,
      statisticalParityDifference: spd,
      equalOpportunity: metrics.equalOpportunity || 1.0,
      status
    });

    // Replicate to Mongo standby
    await replicate('Audit', 'create', audit.toJSON());

    res.status(201).json({
      _id: audit.id,
      datasetName: audit.datasetName,
      targetAttribute: audit.targetAttribute,
      sensitiveAttribute: audit.sensitiveAttribute,
      metrics: {
        disparateImpact: audit.disparateImpact,
        statisticalParityDifference: audit.statisticalParityDifference,
        statisticalParity: audit.statisticalParityDifference,
        equalOpportunity: audit.equalOpportunity
      },
      status: audit.status
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Load audit history from SQL
router.get('/history', protect, async (req, res) => {
  try {
    const audits = await Audit.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    // Format for frontend compat
    const formatted = audits.map(a => ({
      _id: a.id,
      datasetName: a.datasetName,
      targetAttribute: a.targetAttribute,
      sensitiveAttribute: a.sensitiveAttribute,
      metrics: {
        disparateImpact: a.disparateImpact,
        statisticalParityDifference: a.statisticalParityDifference,
        statisticalParity: a.statisticalParityDifference,
        equalOpportunity: a.equalOpportunity
      },
      status: a.status,
      createdAt: a.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
