import { YoutubeTranscript } from "youtube-transcript";
import { Innertube } from "youtubei.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip any residual HTML / XML tags and decode common HTML entities */
const cleanText = (text) =>
  text
    .replace(/<[^>]*>/g, "")             // remove XML/HTML tags
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")             // collapse whitespace
    .trim();

/** Group caption items into readable paragraphs (one paragraph per ~12 items) */
const toParagraphs = (items, chunkSize = 12) => {
  const paragraphs = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    paragraphs.push(chunk.map((c) => cleanText(c.text)).join(" "));
  }
  return paragraphs.join("\n\n");
};

// ── Primary: youtube-transcript ───────────────────────────────────────────────

/** Attempt 1: youtube-transcript with explicit English lang */
const fetchViaYoutubeTranscriptEN = async (videoId) => {
  const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
  if (!items || items.length === 0) return null;
  return toParagraphs(items);
};

/** Attempt 2: youtube-transcript without any lang filter */
const fetchViaYoutubeTranscriptAny = async (videoId) => {
  const items = await YoutubeTranscript.fetchTranscript(videoId);
  if (!items || items.length === 0) return null;
  return toParagraphs(items);
};

// ── Fallback: youtubei.js ─────────────────────────────────────────────────────

/** Attempt 3: youtubei.js (Innertube) – fetches captions directly from YouTube's internal API */
const fetchViaInnertube = async (videoId) => {
  let yt;
  try {
    yt = await Innertube.create({ retrieve_player: false });
  } catch (e) {
    throw new Error(`Innertube init failed: ${e.message}`);
  }

  const info = await yt.getInfo(videoId);
  const transcriptData = await info.getTranscript();

  // youtubei.js returns content in transcript.content.body.initial_segments
  const segments =
    transcriptData?.transcript?.content?.body?.initial_segments || [];

  if (segments.length === 0) return null;

  // Each segment has a `snippet` (TranscriptSegmentRenderer) with text
  const items = segments
    .filter((s) => s?.snippet?.runs)
    .map((s) => ({
      text: s.snippet.runs.map((r) => r.text).join(""),
    }));

  if (items.length === 0) return null;
  return toParagraphs(items);
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the transcript for a YouTube video using a 3-tier fallback strategy:
 *   1. youtube-transcript  (English captions)
 *   2. youtube-transcript  (any available captions)
 *   3. youtubei.js Innertube  (direct YouTube internal API)
 *
 * @param {string} videoId  - 11-character YouTube video ID
 * @returns {Promise<string|null>}  Clean transcript string, or null if unavailable
 */
export const getTranscript = async (videoId) => {
  // ── Tier 1 ───────────────────────────────────────────────────────────────
  try {
    const text = await fetchViaYoutubeTranscriptEN(videoId);
    if (text) {
      console.log("[transcriptService] Tier 1 (youtube-transcript EN) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 1 failed:", e.message);
  }

  // ── Tier 2 ───────────────────────────────────────────────────────────────
  try {
    const text = await fetchViaYoutubeTranscriptAny(videoId);
    if (text) {
      console.log("[transcriptService] Tier 2 (youtube-transcript any lang) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 2 failed:", e.message);
  }

  // ── Tier 3 ───────────────────────────────────────────────────────────────
  try {
    const text = await fetchViaInnertube(videoId);
    if (text) {
      console.log("[transcriptService] Tier 3 (youtubei.js Innertube) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 3 failed:", e.message);
  }

  console.error(`[transcriptService] All 3 tiers failed for videoId: ${videoId}`);
  return null;
};