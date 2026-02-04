const Summary = require("../models/Summary");

// POST /api/summaries
const createSummary = async (req, res) => {
  try {
    const summary = await Summary.create(req.body);
    res.status(201).json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/summaries/:videoId
const getSummaryByVideo = async (req, res) => {
  try {
    const summary = await Summary.findOne({ video: req.params.videoId });
    if (!summary) return res.status(404).json({ error: "Summary not found" });
    res.json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createSummary, getSummaryByVideo };
