// ── Utility helpers ────────────────────────────────────────────────────────────

/**
 * Extract the 11-character YouTube video ID from any common URL format.
 * Mirrors the backend logic so that frontend validation and backend
 * extraction always agree.  Supports extra query params, mobile domains, etc.
 */
export function extractVideoId(url) {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();

    // quick sanity check
    if (!/youtube\.com|youtu\.be/i.test(trimmed)) return null;

    try {
        const parsed = new URL(trimmed);
        // youtu.be short link
        if (parsed.hostname === "youtu.be") {
            const id = parsed.pathname.slice(1).split("/")[0];
            return isValidId(id) ? id : null;
        }

        // youtube.com variants
        if (/youtube\.com/.test(parsed.hostname)) {
            const v = parsed.searchParams.get("v");
            if (v && isValidId(v)) return v;

            const pathMatch = parsed.pathname.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
            if (pathMatch && isValidId(pathMatch[1])) return pathMatch[1];
        }
    } catch {
        // invalid URL string – fall through to regex fallback
    }

    const regexMatch = trimmed.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    return regexMatch && isValidId(regexMatch[1]) ? regexMatch[1] : null;
}

function isValidId(id) {
    return typeof id === "string" && /^[a-zA-Z0-9_-]{11}$/.test(id);
}

/** Basic YouTube URL validation */
export function isValidYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
}

/** Count words in a string */
export function wordCount(text) {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Estimated reading time */
export function readingTime(text) {
    const wpm = 200;
    const mins = Math.ceil(wordCount(text) / wpm);
    return mins === 1 ? "1 min" : `${mins} mins`;
}

/** Sentence count */
export function sentenceCount(text) {
    return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

/** Format seconds → "H:MM:SS" or "M:SS" */
export function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
}

/** Trigger a file download in the browser */
export function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** Export as Markdown file */
export function downloadMarkdown(title, transcript, summary, summaryType) {
    const md = `# ${title}\n\n## ${summaryType} Summary\n\n${summary}\n\n---\n\n## Full Transcript\n\n${transcript}`;
    downloadFile(md, "TubeMind-export.md", "text/markdown");
}

/** Export as PDF via browser print dialog */
export function downloadPdf(title, summary, summaryType, language) {
    const win = window.open("", "_blank");
    win.document.write(`
    <html><head><title>TubeMind – ${summaryType}</title>
    <style>
      body{font-family:'Segoe UI',sans-serif;max-width:720px;margin:48px auto;color:#111;line-height:1.8;font-size:15px}
      h1{color:#7c3aed;font-size:26px;margin-bottom:8px}
      .meta{color:#666;font-size:13px;margin-bottom:24px;border-bottom:1px solid #eee;padding-bottom:16px}
      pre{white-space:pre-wrap;font-family:inherit;font-size:15px;line-height:1.8}
    </style>
    </head><body>
    <h1>TubeMind Summary</h1>
    <div class="meta">
      <strong>Video:</strong> ${title}<br/>
      <strong>Type:</strong> ${summaryType}&nbsp;&nbsp;
      <strong>Language:</strong> ${language}
    </div>
    <pre>${summary}</pre>
    </body></html>
  `);
    win.document.close();
    win.print();
}

/** Copy text to clipboard with a safe fallback */
export function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    });
}
