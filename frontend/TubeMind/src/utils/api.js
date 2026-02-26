import axios from "axios";
import { extractVideoId } from "./helpers";

// Axios instance with relative base URL – avoids CORS in dev
const api = axios.create({
    baseURL: "/",                           // proxied by Vite to :3000
    headers: { "Content-Type": "application/json" },
    timeout: 60_000,
});

export async function processVideoAPI(url) {
    if (!url || typeof url !== "string" || url.trim() === "") {
        throw new Error("Please enter a YouTube URL.");
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
        throw new Error(
            "Invalid YouTube URL. Supported formats:\n" +
            "• https://www.youtube.com/watch?v=VIDEO_ID\n" +
            "• https://youtu.be/VIDEO_ID"
        );
    }

    try {
        // ✅ your required endpoint
        const { data } = await api.get("/api/transcript", {
            params: { url: url.trim() },
        });

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch transcript.");
        }

        const { videoDetails, transcript } = data;

        // Fire-and-forget to /api/videos to trigger AI pipeline (optional)
        triggerAIPipeline(videoId).catch(() => {});

        return {
            videoId,
            title: videoDetails.title,
            channel: videoDetails.channel,
            durationSeconds: videoDetails.durationSeconds,
            thumbnail: videoDetails.thumbnail,
            transcript,
            summary: null, // AI summary is separate
        };

    } catch (err) {
        const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to process video. Please try again.";
        throw new Error(message);
    }
}

async function triggerAIPipeline(videoId) {
    await api.post("/api/videos", { videoId });
}