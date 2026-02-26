import axios from "axios";
import config from "../config/env.js";

// ── Duration helpers ───────────────────────────────────────────────────────────

/** Convert ISO 8601 duration (PT1H2M3S) → total seconds */
const parseDurationToSeconds = (duration) => {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
};

/** Format seconds → "H:MM:SS" or "M:SS" */
const formatDuration = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// ── YouTube Data API v3 ────────────────────────────────────────────────────────

/**
 * Fetch video metadata from YouTube Data API v3.
 * Returns { title, channelName, duration, durationSeconds, thumbnail }
 * or null if the video is not found.
 *
 * Falls back to basic info derived from the video ID if no API key is set.
 */
export const getVideoDetails = async (videoId) => {
  // ── Fallback when no API key is configured ────────────────────────────────
  if (!config.youtubeApiKey) {
    console.warn("[youtubeService] YOUTUBE_API_KEY not set – returning minimal metadata.");
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
      return null; // Video not found
    }

    const item = res.data.items[0];
    const snippet = item.snippet;
    const totalSec = parseDurationToSeconds(item.contentDetails?.duration);

    return {
      title: snippet.title,
      channelName: snippet.channelTitle,
      duration: formatDuration(totalSec),
      durationSeconds: totalSec,
      thumbnail: getBestThumbnail(videoId, snippet.thumbnails),
    };

  } catch (err) {
    console.error("[youtubeService] YouTube API call failed:", err.message);
    // Return minimal metadata rather than crashing the whole pipeline
    return buildMinimalMeta(videoId);
  }
};

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Pick the highest-resolution thumbnail available */
function getBestThumbnail(videoId, thumbnails) {
  if (!thumbnails) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );
}

/** Minimal metadata object when the API is unavailable */
function buildMinimalMeta(videoId) {
  return {
    title: "YouTube Video",
    channelName: "Unknown Channel",
    duration: "0:00",
    durationSeconds: 0,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  };
}