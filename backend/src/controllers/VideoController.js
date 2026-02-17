const Video = require("../models/Video");
const Transcript = require("../models/Transcript");
const Summary = require("../models/Summary");
const { getTranscript } = require("../services/transcriptService");
const { summarizeTranscript } = require("../services/openaiService");

// POST /api/videos
const createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/videos
const getAllVideos = async (_req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/videos/:id
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/videos/:id/status
const getVideoStatus = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    let transcript = await Transcript.findOne({ video: video._id }).select("_id createdAt rawText");
    let transcriptAutoCreated = false;
    let transcriptError = null;

    if (!transcript) {
      try {
        if (!video.videoId) {
          throw new Error("YouTube videoId is missing on this video record");
        }

        const rawText = await getTranscript(video.videoId);
        if (!rawText || !rawText.trim()) {
          throw new Error("Transcript fetch returned empty text");
        }

        transcript = await Transcript.create({
          video: video._id,
          rawText
        });
        transcriptAutoCreated = true;
      } catch (err) {
        transcriptError = err.message;
      }
    }

    let summary = await Summary.findOne({ video: video._id }).select("_id createdAt");
    let summaryAutoCreated = false;
    let summaryError = null;

    if (!summary && transcript) {
      try {
        const generatedSummary = await summarizeTranscript({
          videoTitle: video.title || video.videoId,
          transcriptText: transcript.rawText || ""
        });

        summary = await Summary.create({
          video: video._id,
          ...generatedSummary
        });
        summaryAutoCreated = true;
      } catch (err) {
        summaryError = err.message;
      }
    }

    const transcriptView = transcript
      ? { _id: transcript._id, createdAt: transcript.createdAt }
      : null;

    res.json({
      videoId: video._id,
      youtubeVideoId: video.videoId,
      hasTranscript: Boolean(transcript),
      hasSummary: Boolean(summary),
      transcriptAutoCreated,
      transcriptError,
      summaryAutoCreated,
      summaryError,
      transcript: transcriptView,
      summary: summary || null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createVideo, getAllVideos, getVideoById, getVideoStatus };
