import Transcript from "../models/Transcript.js";

export const createTranscript = async (req, res) => {
  try {
    const transcript = await Transcript.create(req.body);
    res.status(201).json(transcript);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTranscriptByVideo = async (req, res) => {
  try {
    const transcript = await Transcript.findOne({ video: req.params.videoId });
    if (!transcript) return res.status(404).json({ error: "Transcript not found" });
    res.json(transcript);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};