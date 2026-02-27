import axios from "axios";
import { extractVideoId } from "./helpers";

const api = axios.create({
    baseURL: "",
    headers: { "Content-Type": "application/json" },
    timeout: 90_000,
});

export async function processVideoAPI(url) {
    if (!url) throw new Error("URL required");
    const videoId = extractVideoId(url);
    if (!videoId) throw new Error("Invalid URL");

    try {
        // Fast fetch (Meta + Transcript)
        const fast = await api.get("/api/transcript", { params: { url: url.trim() } });
        if (!fast.data.success) throw new Error(fast.data.message);

        const { videoDetails, transcript } = fast.data;

        // Slow fetch (AI Summary) - handle gracefully
        let summary = null;
        try {
            const summaryRes = await api.post("/api/videos", { videoId });
            summary = summaryRes.data.summary;
        } catch (sumErr) {
            console.warn("[API] Summary fetch failed:", sumErr.message);
        }

        return {
            videoId,
            ...videoDetails,
            transcript,
            summary,
        };
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Fetch failed");
    }
}
