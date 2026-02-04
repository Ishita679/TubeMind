const Transcript = require("../models/Transcript");

// POST /api/transcripts
const createTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.create(req.body);
    res.status(201).json(transcript);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/transcripts/:videoId
const getTranscriptByVideo = async (req, res) => {
  try {
    const transcript = await Transcript.findOne({ video: req.params.videoId });
    if (!transcript) return res.status(404).json({ error: "Transcript not found" });
    res.json(transcript);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createTranscript, getTranscriptByVideo };
