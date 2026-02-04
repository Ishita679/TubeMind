const QA = require("../models/QA");

// POST /api/qa
const createQA = async (req, res) => {
  try {
    const qa = await QA.create(req.body);
    res.status(201).json(qa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/qa/:videoId
const getQAByVideo = async (req, res) => {
  try {
    const qa = await QA.find({ video: req.params.videoId }).sort({ createdAt: -1 });
    res.json(qa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createQA, getQAByVideo };
