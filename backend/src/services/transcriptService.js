import { YoutubeTranscript } from "youtube-transcript";
import { Innertube } from "youtubei.js";
import { getSubtitles } from "youtube-captions-scraper";

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

// ── Supplemental: youtube‑captions‑scraper (last‑resort) ───────────────────────
// A lightweight scraper that parses the captions JSON embedded in the page.  It
// works in environments where the other libraries sometimes fail due to API
// changes or network restrictions.

/**
 * Attempt 3: youtube-captions-scraper (generic XML captions extractor)
 * Returns plain text paragraphs or null if the video has no usable captions.
 */
const fetchViaCaptionsScraper = async (videoId) => {
  try {
    const lines = await getSubtitles({ videoID: videoId, lang: "en" });
    if (!lines || lines.length === 0) return null;
    // scraper returns objects with {start,dur,text}
    const items = lines.map((l) => ({ text: l.text }));
    return toParagraphs(items);
  } catch (e) {
    // the library throws if no captions or if the language isn't available
    return null;
  }
};

// ── Fallback: youtubei.js ─────────────────────────────────────────────────────

/**
 * Attempt 3: youtubei.js (Innertube) – fetches captions directly from YouTube's
 * internal API.  Innertube is the most reliable source and will return both
 * manually uploaded and auto‑generated captions, so we call it first in the
 * public `getTranscript` flow below.
 */
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
 * Fetch the transcript for a YouTube video using a multi‑tier fallback strategy:
 *   1. youtubei.js Innertube  (direct YouTube internal API)
 *   2. youtube-transcript  (English captions)
 *   3. youtube-transcript  (any available captions)
 *   4. youtube-captions-scraper (XML caption extractor)
 *
 * Innertube is attempted first because it is the most modern and tends to
 * succeed for auto‑generated captions as well as uploads.  When it fails we
 * fall back to various HTTP scrapers in descending order of preference.
 *
 * @param {string} videoId  - 11-character YouTube video ID
 * @returns {Promise<string|null>}  Clean transcript string, or null if unavailable
 */
export const getTranscript = async (videoId) => {
  // ── Tier 1 (preferred) – Innertube because it's the most reliable / modern API
  try {
    const text = await fetchViaInnertube(videoId);
    if (text) {
      console.log("[transcriptService] Tier 1 (youtubei.js Innertube) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 1 failed:", e.message);
  }

  // ── Tier 2 – youtube-transcript with explicit English lang
  try {
    const text = await fetchViaYoutubeTranscriptEN(videoId);
    if (text) {
      console.log("[transcriptService] Tier 2 (youtube-transcript EN) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 2 failed:", e.message);
  }

  // ── Tier 3 – youtube-transcript without any language filter
  try {
    const text = await fetchViaYoutubeTranscriptAny(videoId);
    if (text) {
      console.log("[transcriptService] Tier 3 (youtube-transcript any lang) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 3 failed:", e.message);
  }

  // ── Tier 4 – youtube-captions-scraper
  try {
    const text = await fetchViaCaptionsScraper(videoId);
    if (text) {
      console.log("[transcriptService] Tier 4 (captions-scraper) succeeded.");
      return text;
    }
  } catch (e) {
    console.warn("[transcriptService] Tier 4 failed:", e.message);
  }

  console.error(`[transcriptService] All 4 tiers failed for videoId: ${videoId}`);
  return null;
};