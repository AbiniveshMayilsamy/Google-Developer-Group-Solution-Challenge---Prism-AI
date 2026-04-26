const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../services/gemini');

router.post('/recommendations', async (req, res) => {
  try {
    const { metrics, datasetContext } = req.body;
    
    if (!metrics) {
      return res.status(400).json({ error: 'Metrics are required' });
    }

    const recommendations = await getRecommendations(metrics, datasetContext);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations. Please check API configuration.' });
  }
});

module.exports = router;
