export function extractVideoId(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();

    if (!/youtube\.com|youtu\.be/i.test(trimmed)) return null;

    try {
        const parsed = new URL(trimmed);
        if (parsed.hostname === "youtu.be") {
            const id = parsed.pathname.slice(1).split("/")[0];
            return isValidId(id) ? id : null;
        }

        if (/youtube\.com/.test(parsed.hostname)) {
            const v = parsed.searchParams.get("v");
            if (v && isValidId(v)) return v;

            const pathMatch = parsed.pathname.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
            if (pathMatch && isValidId(pathMatch[1])) return pathMatch[1];
        }
    } catch {
        // regex fallback
    }

    const regexMatch = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    return regexMatch && isValidId(regexMatch[1]) ? regexMatch[1] : null;
}

function isValidId(id) {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
}