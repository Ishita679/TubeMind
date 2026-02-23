import Video from "../models/Video.js";
import Transcript from "../models/Transcript.js";
import Summary from "../models/Summary.js";
import { getVideoDetails } from "../services/youtubeService.js";
import { getTranscript } from "../services/transcriptService.js";
import { summarizeTranscript } from "../services/openaiService.js";

export const createVideo = async (req, res) => {
  let savedVideoId = null; // Track the ID so we can clean up if it crashes
  
  try {
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ message: "videoId is required" });

    // 1. Check if we already processed this video completely
    let video = await Video.findOne({ videoId });
    if (video) {
      const existingSummary = await Summary.findOne({ video: video._id });
      if (existingSummary) {
        return res.status(200).json({ message: "Video already processed", summary: existingSummary });
      }
      // If video exists but summary doesn't, it means a previous run crashed. 
      // We will overwrite it and finish the job!
      savedVideoId = video._id; 
    } else {
      // 2. Fetch YouTube Metadata
      const ytDetails = await getVideoDetails(videoId);
      if (!ytDetails) return res.status(404).json({ message: "Video not found on YouTube" });

      // Save Video to DB
      video = await Video.create({
        videoId,
        title: ytDetails.title,
        channelName: ytDetails.channelName,
        durationSeconds: ytDetails.duration
      });
      savedVideoId = video._id;
    }

    // 3. Fetch Transcript
    const transcriptText = await getTranscript(videoId);
    console.log("=== RAW TRANSCRIPT EXTRACTED ===");
    console.log(transcriptText);
    console.log("================================");
    if (!transcriptText || transcriptText.trim() === "") {
       throw new Error("Could not extract transcript. The video might not have captions enabled.");
    }
    
    // Upsert Transcript (forces an overwrite if it existed from a partial run)
    await Transcript.findOneAndUpdate(
      { video: savedVideoId },
      { rawText: transcriptText },
      { upsert: true, returnDocument: 'after' }
    );

    // 4. Summarize via OpenAI
    const summaryData = await summarizeTranscript({
      videoTitle: video.title,
      transcriptText
    });

    // 5. Save Summary to DB
    const summary = await Summary.findOneAndUpdate(
       { video: savedVideoId },
       { ...summaryData },
       { upsert: true, returnDocument: 'after' }
    );

    res.status(201).json({ message: "Successfully processed video", summary });

  } catch (err) {
    console.error("[Create Video Error]:", err.message);
    
    // THE SELF-HEALING CLEANUP: Delete the half-saved video if the pipeline crashed
    if (savedVideoId) {
       await Video.findByIdAndDelete(savedVideoId);
       await Transcript.findOneAndDelete({ video: savedVideoId });
    }
    
    res.status(500).json({ error: err.message });
  }
};

export const getAllVideos = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.status(200).json(videos);
};

export const getVideoById = async (req, res) => {
  const video = await Video.findOne({ videoId: req.params.id });
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.status(200).json(video);
};

export const getVideoStatus = async (req, res) => {
  res.status(200).json({ status: "processing" }); 
};