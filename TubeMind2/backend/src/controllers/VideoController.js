import Video from "../models/Video.js";
import Transcript from "../models/Transcript.js";
import Summary from "../models/Summary.js";
import { getVideoDetails } from "../services/youtubeService.js";
import { getTranscript } from "../services/transcriptService.js";
import { summarizeTranscript } from "../services/openaiService.js";

export const processVideo = async (req, res, next) => {
    try {
        const { videoId } = req.body;
        if (!videoId) return res.status(400).json({ message: "videoId required" });

        let video = await Video.findOne({ videoId });
        if (video) {
            const summary = await Summary.findOne({ video: video._id });
            if (summary) return res.json({ summary });
        } else {
            const details = await getVideoDetails(videoId);
            video = await Video.create({ videoId, ...details });
        }

        const text = await getTranscript(videoId);
        // If text is null or empty, it means all tiers failed. throw specific error.
        if (!text) throw new Error("Could not retrieve transcript from YouTube (All fallbacks failed).");

        await Transcript.create({ video: video._id, rawText: text });

        const summaryData = await summarizeTranscript({ videoTitle: video.title, transcriptText: text });
        const summary = await Summary.create({ video: video._id, ...summaryData });

        res.status(201).json({ summary });
    } catch (err) { next(err); }
};
