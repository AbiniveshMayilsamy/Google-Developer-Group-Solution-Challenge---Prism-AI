const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRecommendations,
  getAuditSummary,
  getDriftExplanation,
  getFirewallInsight,
  getVertexPipeline,
  getBiasMetricAnalysis,
} = require('../services/gemini');

// helper — always send the real error message
const aiRoute = (fn) => async (req, res) => {
  try {
    const result = await fn(req);
    res.json(result);
  } catch (err) {
    console.error('AI route error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

router.post('/ai/bias-analysis', protect, aiRoute(async (req) => {
  const { metrics, config, laymanMode } = req.body;
  if (!metrics) throw new Error('metrics are required');
  const analysis = await getBiasMetricAnalysis(metrics, config, laymanMode);
  return { analysis };
}));

router.post('/recommendations', protect, aiRoute(async (req) => {
  const { metrics, datasetContext, laymanMode } = req.body;
  if (!metrics) throw new Error('metrics are required');
  const recommendations = await getRecommendations(metrics, datasetContext, laymanMode);
  return { recommendations };
}));

router.post('/ai/audit-summary', protect, aiRoute(async (req) => {
  const { laymanMode } = req.body;
  const summary = await getAuditSummary(req.body, laymanMode);
  return { summary };
}));

router.post('/ai/drift-explanation', protect, aiRoute(async (req) => {
  const { laymanMode } = req.body;
  const explanation = await getDriftExplanation(req.body, laymanMode);
  return { explanation };
}));

router.post('/ai/firewall-insight', protect, aiRoute(async (req) => {
  const { blockedReason, endpoint, laymanMode } = req.body;
  const insight = await getFirewallInsight(blockedReason, endpoint, laymanMode);
  return { insight };
}));

router.post('/ai/vertex-pipeline', protect, aiRoute(async (req) => {
  const { metrics, config } = req.body;
  if (!metrics || !config) throw new Error('metrics and config are required');
  const code = await getVertexPipeline(metrics, config);
  return { code };
}));

// ─── Integration endpoint (public, no AI) ─────────────────────────────────────
router.post('/integration/evaluate-hiring', (req, res) => {
  const { name, casteCategory, dialectAccent, interviewScore } = req.body;
  if (interviewScore === undefined) return res.status(400).json({ error: 'interviewScore is required' });

  let threshold = 70;
  const biasReason = [];

  if (dialectAccent === 'Regional Accent') { threshold += 12; biasReason.push('Dialect/Accent Bias'); }
  if (casteCategory  === 'Reserved')       { threshold += 8;  biasReason.push('Caste Bias'); }

  const score       = Number(interviewScore);
  const decision    = score >= threshold ? 'Hired' : 'Rejected';
  const fairDecision = score >= 70       ? 'Hired' : 'Rejected';

  res.json({
    candidateName: name || 'Anonymous',
    score,
    decision,
    biasRisk:  biasReason.length ? 'High' : 'Low',
    reasons:   biasReason,
    mitigationAlert: decision !== fairDecision,
    actionRecommended: decision !== fairDecision
      ? 'WARNING: Bias detected. Review candidate without sensitive attributes.'
      : 'No bias intervention required.',
  });
});

module.exports = router;
