import Summary from "../models/Summary.js";

export const createSummary = async (req, res) => {
  try {
    const summary = await Summary.create(req.body);
    res.status(201).json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getSummaryByVideo = async (req, res) => {
  try {
    const summary = await Summary.findOne({ video: req.params.videoId });
    if (!summary) return res.status(404).json({ error: "Summary not found" });
    res.json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};