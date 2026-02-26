import { extractVideoId } from "../utils/videoIdParser.js";
import { getVideoDetails } from "../services/youtubeService.js";
import { getTranscript } from "../services/transcriptService.js";

/**
 * GET /api/transcript?url=<YOUTUBE_URL>
 *
 * Lightweight single-purpose endpoint:
 *   1. Validates and extracts the video ID from the URL
 *   2. Fetches video metadata (title, channel, duration, thumbnail)
 *   3. Fetches the transcript text
 *
 * Does NOT require MongoDB. Does NOT call OpenAI / Groq.
 * Designed to work even when the AI summarisation pipeline is not configured.
 *
 * Success response:
 *   { success: true, videoDetails: { title, thumbnail, channel, duration }, transcript: "..." }
 *
 * Error response:
 *   { success: false, message: "..." }
 */
export const getTranscriptByUrl = async (req, res) => {
    const { url } = req.query;

    // ── 1. Validate input ────────────────────────────────────────────────────
    if (!url || typeof url !== "string" || url.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Query parameter 'url' is required. Example: /api/transcript?url=https://www.youtube.com/watch?v=VIDEO_ID",
        });
    }

    // ── 2. Extract video ID ──────────────────────────────────────────────────
    const videoId = extractVideoId(url.trim());
    if (!videoId) {
        return res.status(400).json({
            success: false,
            message:
                "Invalid YouTube URL. Supported formats: " +
                "https://www.youtube.com/watch?v=VIDEO_ID  or  https://youtu.be/VIDEO_ID",
        });
    }

    // ── 3. Fetch metadata + transcript in parallel ───────────────────────────
    let videoDetails = null;
    let transcript = null;

    try {
        [videoDetails, transcript] = await Promise.all([
            getVideoDetails(videoId).catch((err) => {
                console.warn("[transcriptApiController] metadata fetch failed:", err.message);
                return null; // non-fatal
            }),
            getTranscript(videoId),
        ]);
    } catch (err) {
        console.error("[transcriptApiController] unexpected error:", err.message);
        return res.status(500).json({
            success: false,
            message: "An unexpected server error occurred. Please try again.",
        });
    }

    // ── 4. Handle missing transcript ─────────────────────────────────────────
    if (!transcript || transcript.trim() === "") {
        return res.status(404).json({
            success: false,
            message:
                "Transcript not found for this video. " +
                "The video may not have captions enabled, may be age-restricted, " +
                "or YouTube is temporarily blocking automated access.",
        });
    }

    // ── 5. Build and return structured response ───────────────────────────────
    return res.status(200).json({
        success: true,
        videoDetails: {
            title: videoDetails?.title ?? "Unknown Title",
            thumbnail: videoDetails?.thumbnail ?? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            channel: videoDetails?.channelName ?? "Unknown Channel",
            duration: videoDetails?.duration ?? "0:00",
            durationSeconds: videoDetails?.durationSeconds ?? 0,
        },
        transcript,
    });
};
