const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getRecommendations, 
  getAuditSummary, 
  getDriftExplanation, 
  getFirewallInsight,
  getVertexPipeline
} = require('../services/gemini');

router.post('/recommendations', protect, async (req, res) => {
  try {
    const { metrics, datasetContext, laymanMode } = req.body;
    if (!metrics) return res.status(400).json({ error: 'Metrics are required' });
    const recommendations = await getRecommendations(metrics, datasetContext, laymanMode);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

router.post('/ai/audit-summary', protect, async (req, res) => {
  try {
    const laymanMode = req.body.laymanMode;
    const summary = await getAuditSummary(req.body, laymanMode);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate audit summary.' });
  }
});

router.post('/ai/drift-explanation', protect, async (req, res) => {
  try {
    const laymanMode = req.body.laymanMode;
    const explanation = await getDriftExplanation(req.body, laymanMode);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate drift explanation.' });
  }
});

router.post('/ai/firewall-insight', protect, async (req, res) => {
  try {
    const { blockedReason, endpoint, laymanMode } = req.body;
    const insight = await getFirewallInsight(blockedReason, endpoint, laymanMode);
    res.json({ insight });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate firewall insight.' });
  }
});

router.post('/ai/vertex-pipeline', protect, async (req, res) => {
  try {
    const { metrics, config } = req.body;
    if (!metrics || !config) return res.status(400).json({ error: 'Metrics and config are required' });
    const code = await getVertexPipeline(metrics, config);
    res.json({ code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate Vertex AI pipeline code.' });
  }
});

// @route   POST /api/integration/evaluate-hiring
// @desc    Evaluate single candidate for external HR systems
// @access  Public (Mock integration)
router.post('/integration/evaluate-hiring', async (req, res) => {
  const { name, stateOfOrigin, casteCategory, dialectAccent, interviewScore } = req.body;

  if (interviewScore === undefined) {
    return res.status(400).json({ error: 'interviewScore is required' });
  }

  // Simulating biased threshold behavior
  let threshold = 70;
  let hasBiasPenalty = false;
  let biasReason = [];

  if (dialectAccent === 'Regional Accent') {
    threshold += 12; // Requires 82+
    hasBiasPenalty = true;
    biasReason.push('Dialect/Accent Bias (Regional accent detected)');
  }
  if (casteCategory === 'Reserved') {
    threshold += 8; // Requires 78+
    hasBiasPenalty = true;
    biasReason.push('Caste Bias (Reserved category detected)');
  }

  const scoreNum = Number(interviewScore);
  const decision = scoreNum >= threshold ? 'Hired' : 'Rejected';
  const fairDecision = scoreNum >= 70 ? 'Hired' : 'Rejected';
  const isDifferent = decision !== fairDecision;

  res.json({
    candidateName: name || 'Anonymous Candidate',
    score: scoreNum,
    decision: decision,
    biasRisk: hasBiasPenalty ? 'High' : 'Low',
    reasons: biasReason,
    mitigationAlert: isDifferent,
    actionRecommended: isDifferent 
      ? 'WARNING: The system detected potential bias influencing the outcome. Review candidate blindly without Caste and Dialect attributes.'
      : 'No critical bias intervention required for this score.'
  });
});

module.exports = router;
