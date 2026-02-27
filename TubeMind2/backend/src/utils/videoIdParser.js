export function extractVideoId(url) {
    if (!url || typeof url !== "string") return null;

    const trimmed = url.trim();

    const patterns = [
        /(?:v=|\/v\/|embed\/|shorts\/|live\/|youtu\.be\/|\/be\/|watch\?v%3D|watch\?feature=player_embedded&v=)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    try {
        const parsed = new URL(trimmed);
        if (parsed.hostname.includes("youtube.com")) {
            const v = parsed.searchParams.get("v");
            if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
        }
        if (parsed.hostname === "youtu.be") {
            const id = parsed.pathname.slice(1).split("/")[0];
            if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
        }
    } catch (e) { }

    return null;
}
