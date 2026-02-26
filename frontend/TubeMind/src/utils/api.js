import axios from "axios";
import { extractVideoId } from "./helpers";

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance for the backend
// Using a RELATIVE base URL so Vite's dev-proxy (/api → :3000) handles routing.
// This also prevents CORS issues since the request appears same-origin in dev.
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: "/",                           // relative — proxied by Vite to :3000
    headers: { "Content-Type": "application/json" },
    timeout: 60_000,                        // 60 s timeout (AI calls can be slow)
});

// ─────────────────────────────────────────────────────────────────────────────
//  Primary: GET /api/transcript?url=<YOUTUBE_URL>
//
//  Returns:
//    { videoId, title, channel, durationSeconds, thumbnail, transcript, summary }
//
//  The `summary` field is null when the backend is running without an AI key
//  (Groq / OpenAI). The transcript and metadata are always populated on success.
// ─────────────────────────────────────────────────────────────────────────────
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
        // ── Fetch transcript + metadata via the dedicated endpoint ────────────
        const { data } = await api.get("/api/transcript", {
            params: { url: url.trim() },
        });

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch transcript.");
        }

        const { videoDetails, transcript } = data;

        // ── Optionally trigger the full AI pipeline in the background ─────────
        // We fire-and-forget the POST /api/videos call so the summary can be
        // stored in MongoDB. The UI doesn't wait for it here.
        triggerAIPipeline(videoId).catch(() => {/* silently ignore */ });

        return {
            videoId,
            title: videoDetails.title,
            channel: videoDetails.channel,
            durationSeconds: videoDetails.durationSeconds,
            thumbnail: videoDetails.thumbnail,
            transcript,
            summary: null, // AI summary loaded separately if needed
        };

    } catch (err) {
        // Surface the real backend error message
        const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Failed to process video. Please try again.";
        throw new Error(message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Trigger the full AI pipeline (transcript → MongoDB → Groq summary).
//  Non-fatal: called fire-and-forget from processVideoAPI above.
// ─────────────────────────────────────────────────────────────────────────────
async function triggerAIPipeline(videoId) {
    await api.post("/api/videos", { videoId });
}

// ─────────────────────────────────────────────────────────────────────────────
//  Fallback dummy data — useful for UI development / demo mode.
//  Returns the same shape as processVideoAPI() but with mock content.
// ─────────────────────────────────────────────────────────────────────────────
export async function getDummyData(url) {
    await new Promise((r) => setTimeout(r, 2200));
    const videoId = extractVideoId(url) || "dQw4w9WgXcQ";
    return {
        videoId,
        title: "The Future of Artificial Intelligence — Full Lecture",
        channel: "MIT OpenCourseWare",
        durationSeconds: 5077,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        transcript:
            "Welcome to today's lecture on the future of artificial intelligence.\n\n" +
            "Over the past several years, we have witnessed an extraordinary acceleration in the " +
            "capabilities of AI systems. The development of large language models represents a " +
            "qualitative leap beyond what was possible just a decade ago.\n\n" +
            "One of the central challenges our field faces is the problem of AI alignment — " +
            "how do we ensure that a system optimising for a given objective actually does what " +
            "we intend and value?\n\n" +
            "The economic implications of AI are just as consequential as the technical ones. " +
            "Automation has always displaced workers, but AI may do so at a scale and speed " +
            "that outpaces society's ability to adapt.\n\n" +
            "On the optimistic side, AI offers radically accelerating scientific progress in " +
            "healthcare, climate science, and beyond.",
        summary: null,
    };
}
