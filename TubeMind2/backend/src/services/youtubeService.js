import axios from "axios";
import config from "../config/env.js";

const parseDurationToSeconds = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
};

const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return "0:00";
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${m}:${String(s).padStart(2, "0")}`;
};

export const getVideoDetails = async (videoId) => {
    if (!config.youtubeApiKey) {
        console.warn("[youtubeService] YOUTUBE_API_KEY not set.");
        return buildMinimalMeta(videoId);
    }

    try {
        const url = "https://www.googleapis.com/youtube/v3/videos";
        const res = await axios.get(url, {
            params: {
                part: "snippet,contentDetails",
                id: videoId,
                key: config.youtubeApiKey,
            },
            timeout: 10_000,
        });

        if (!res.data.items || res.data.items.length === 0) {
            return null;
        }

        const item = res.data.items[0];
        const snippet = item.snippet;
        const totalSec = parseDurationToSeconds(item.contentDetails?.duration);

        return {
            title: snippet.title,
            description: snippet.description,
            channelName: snippet.channelTitle,
            duration: formatDuration(totalSec),
            durationSeconds: totalSec,
            thumbnail: getBestThumbnail(videoId, snippet.thumbnails),
        };

    } catch (err) {
        console.error("[youtubeService] API call failed:", err.message);

        // Final fallback: Scrape Basic Meta from Page HTML
        try {
            console.log("[youtubeService] Attempting manual meta scrape...");
            const { data: html } = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
            const channelMatch = html.match(/"author":"(.*?)"/);

            return {
                title: titleMatch ? titleMatch[1] : "YouTube Video",
                description: "Description fetch failed (API Limited)",
                channelName: channelMatch ? channelMatch[1] : "Unknown Channel",
                duration: "0:00",
                durationSeconds: 0,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            };
        } catch (scrapeErr) {
            return buildMinimalMeta(videoId);
        }
    }
};

function getBestThumbnail(videoId, thumbnails) {
    if (!thumbnails) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const options = ["maxres", "standard", "high", "medium", "default"];
    for (const opt of options) {
        if (thumbnails[opt]) return thumbnails[opt].url;
    }
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
}

function buildMinimalMeta(videoId) {
    return {
        title: "YouTube Video",
        description: "",
        channelName: "Unknown Channel",
        duration: "0:00",
        durationSeconds: 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
}
