const { Router } = require('express');
const { protect } = require('../middleware/auth.middleware.js');
const AnalysisResult = require('../models/AnalysisResult.js');

const router = Router();

// @route   GET api/analysis
// @desc    Get all analysis results for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const results = await AnalysisResult.find({ userId }).sort({ createdAt: -1 });
     console.log('GET /analysis received');
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analysis/:id
// @desc    Get a specific analysis result by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await AnalysisResult.findOne({ _id: req.params.id, userId });

    if (!result) {
      return res.status(404).json({ msg: 'Result not found or not authorized' });
    }
    res.json(result);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Result not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
