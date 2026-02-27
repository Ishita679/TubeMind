export function extractVideoId(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    const patterns = [
        /(?:v=|\/v\/|embed\/|shorts\/|live\/|youtu\.be\/|\/be\/|watch\?v%3D|watch\?feature=player_embedded&v=)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match && match[1]) return match[1];
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

export function isValidYouTubeUrl(url) {
    return !!extractVideoId(url);
}

export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}

export function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

export function wordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
}

export function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

export function downloadMarkdown(title, transcript, summary, summaryType) {
    const md = `# ${title}\n\n## Summary (${summaryType})\n${summary}\n\n---\n\n## Transcript\n${transcript}\n`;
    downloadFile(md, "summary.md", "text/markdown");
}

export function downloadPdf(title, content, summaryType, lang) {
    const w = window.open("", "_blank");
    w.document.write(`<html><body><h1>${title}</h1><h3>${summaryType}</h3><p>Language: ${lang}</p><pre>${content}</pre></body></html>`);
    w.document.close();
}
