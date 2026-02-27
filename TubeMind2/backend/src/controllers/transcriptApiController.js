import { extractVideoId } from "../utils/videoIdParser.js";
import { getVideoDetails } from "../services/youtubeService.js";
import { getTranscript } from "../services/transcriptService.js";

export const getTranscriptByUrl = async (req, res, next) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "URL required" });

        const videoId = extractVideoId(url);
        if (!videoId) return res.status(400).json({ success: false, message: "Invalid URL" });

        const meta = await getVideoDetails(videoId);
        let text = null;
        let transcriptError = null;

        try {
            text = await getTranscript(videoId);
        } catch (err) {
            console.warn(`[TranscriptAPI] Transcript failed: ${err.message}`);
            transcriptError = err.message;
        }

        res.json({
            success: true,
            videoDetails: {
                videoId: videoId,
                title: meta?.title || "Unknown",
                description: meta?.description || "",
                thumbnail: meta?.thumbnail || "",
                channel: meta?.channelName || "Unknown",
                duration: meta?.duration || "0:00",
                durationSeconds: meta?.durationSeconds || 0,
            },
            transcript: text,
            transcriptError: transcriptError
        });
    } catch (err) {
        console.error(`[TranscriptAPI] Fatal Error: ${err.message}`);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to process request"
        });
    }
};
