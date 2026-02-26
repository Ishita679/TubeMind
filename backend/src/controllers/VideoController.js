import Video from "../models/Video.js";
import Transcript from "../models/Transcript.js";
import Summary from "../models/Summary.js";
import { getVideoDetails } from "../services/youtubeService.js";
import { getTranscript } from "../services/transcriptService.js";
import { summarizeTranscript } from "../services/openaiService.js";
import config from "../config/env.js";

// ── POST /api/videos ──────────────────────────────────────────────────────────
export const createVideo = async (req, res) => {
  let savedVideoId = null;

  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ message: "videoId is required" });

    // 1. Check if already fully processed
    let video = await Video.findOne({ videoId });
    if (video) {
      const existingSummary = await Summary.findOne({ video: video._id });
      if (existingSummary) {
        const existingTranscript = await Transcript.findOne({ video: video._id });
        return res.status(200).json({
          message: "Video already processed",
          summary: existingSummary,
          transcript: existingTranscript?.rawText || null,
        });
      }
      savedVideoId = video._id;
    } else {
      // 2. Fetch YouTube Metadata
      const ytDetails = await getVideoDetails(videoId);
      if (!ytDetails) return res.status(404).json({ message: "Video not found on YouTube" });

      video = await Video.create({
        videoId,
        title: ytDetails.title,
        channelName: ytDetails.channelName,
        durationSeconds: ytDetails.durationSeconds ?? ytDetails.duration,
      });
      savedVideoId = video._id;
    }

    // 3. Fetch Transcript
    const transcriptText = await getTranscript(videoId);
    if (!transcriptText || transcriptText.trim() === "") {
      throw new Error(
        "No captions found for this video. The video may not have subtitles enabled, " +
        "or YouTube is blocking automated access. Please try a video with captions."
      );
    }

    // Upsert Transcript
    await Transcript.findOneAndUpdate(
      { video: savedVideoId },
      { rawText: transcriptText },
      { upsert: true, returnDocument: "after" }
    );

    // 4. Summarize via AI (optional — skip gracefully if no API key configured)
    let summaryData = null;
    const hasAiKey = !!(config.groqApiKey || config.openaiApiKey);

    if (hasAiKey) {
      try {
        summaryData = await summarizeTranscript({
          videoTitle: video.title,
          transcriptText,
        });
      } catch (aiErr) {
        console.warn("[createVideo] AI summarisation failed (non-fatal):", aiErr.message);
        // Proceed without summary rather than crashing
      }
    } else {
      console.warn("[createVideo] No GROQ_API_KEY or OPENAI_API_KEY – skipping AI summarisation.");
    }

    // 5. Save Summary (if we have one)
    let summary = null;
    if (summaryData) {
      summary = await Summary.findOneAndUpdate(
        { video: savedVideoId },
        { ...summaryData },
        { upsert: true, returnDocument: "after" }
      );
    }

    res.status(201).json({
      message: "Successfully processed video",
      summary,
      transcript: transcriptText,
    });

  } catch (err) {
    console.error("[Create Video Error]:", err.message);

    // Self-healing cleanup: remove half-saved records
    if (savedVideoId) {
      await Video.findByIdAndDelete(savedVideoId).catch(() => { });
      await Transcript.findOneAndDelete({ video: savedVideoId }).catch(() => { });
    }

    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/videos ───────────────────────────────────────────────────────────
export const getAllVideos = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.status(200).json(videos);
};

// ── GET /api/videos/:id ───────────────────────────────────────────────────────
export const getVideoById = async (req, res) => {
  const video = await Video.findOne({ videoId: req.params.id });
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.status(200).json(video);
};

// ── GET /api/videos/:id/status ────────────────────────────────────────────────
export const getVideoStatus = async (_req, res) => {
  res.status(200).json({ status: "processing" });
};