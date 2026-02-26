/**
 * Extract the 11-character YouTube video ID from any common YouTube URL format.
 *
 * Supported formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://www.youtube.com/watch?v=VIDEO_ID&t=123
 *   https://youtu.be/VIDEO_ID
 *   https://youtu.be/VIDEO_ID?t=123
 *   https://www.youtube.com/embed/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://m.youtube.com/watch?v=VIDEO_ID
 *
 * @param {string} url
 * @returns {string|null}  11-char video ID, or null if not a valid YouTube URL
 */
export function extractVideoId(url) {
    if (!url || typeof url !== "string") return null;

    // Normalise: trim whitespace
    const trimmed = url.trim();

    // Bail out early if it obviously isn't a YouTube URL
    if (!/youtube\.com|youtu\.be/i.test(trimmed)) return null;

    try {
        const parsed = new URL(trimmed);

        // ── youtu.be/VIDEO_ID ──────────────────────────────────────────────────
        if (parsed.hostname === "youtu.be") {
            const id = parsed.pathname.slice(1).split("/")[0];
            return isValidId(id) ? id : null;
        }

        // ── youtube.com variants ───────────────────────────────────────────────
        if (/youtube\.com/.test(parsed.hostname)) {
            // /watch?v=VIDEO_ID
            const vParam = parsed.searchParams.get("v");
            if (vParam && isValidId(vParam)) return vParam;

            // /embed/VIDEO_ID  or  /shorts/VIDEO_ID  or  /live/VIDEO_ID
            const pathMatch = parsed.pathname.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
            if (pathMatch && isValidId(pathMatch[1])) return pathMatch[1];
        }
    } catch {
        // URL parsing failed – try a regex fallback
    }

    // ── Regex fallback (handles malformed URLs) ─────────────────────────────
    const regexMatch = trimmed.match(
        /(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/
    );
    return regexMatch && isValidId(regexMatch[1]) ? regexMatch[1] : null;
}

/** YouTube video IDs are exactly 11 URL-safe base64 characters */
function isValidId(id) {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
}
