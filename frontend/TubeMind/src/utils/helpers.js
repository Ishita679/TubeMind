// ── Utility helpers ────────────────────────────────────────────────────────────

/** Extract the YouTube video ID from any valid YouTube URL */
export function extractVideoId(url) {
    const regex = /(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
