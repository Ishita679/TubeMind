// ── API ────────────────────────────────────────────────────────────────────────
export const API_BASE = "http://localhost:3000";

// ── Languages (no flag emojis — use 2-letter code badges instead) ──────────────
export const LANGUAGES = [
    { code: "en", label: "English", flag: "EN" },
    { code: "hi", label: "Hindi", flag: "HI" },
    { code: "es", label: "Spanish", flag: "ES" },
    { code: "fr", label: "French", flag: "FR" },
    { code: "de", label: "German", flag: "DE" },
    { code: "ja", label: "Japanese", flag: "JA" },
    { code: "zh", label: "Chinese", flag: "ZH" },
    { code: "ar", label: "Arabic", flag: "AR" },
    { code: "pt", label: "Portuguese", flag: "PT" },
    { code: "ru", label: "Russian", flag: "RU" },
    { code: "ko", label: "Korean", flag: "KO" },
    { code: "it", label: "Italian", flag: "IT" },
];

// ── Summary types ──────────────────────────────────────────────────────────────
export const SUMMARY_TYPES = [
    { id: "short", label: "Short", desc: "Concise 2-3 sentence overview" },
    { id: "detailed", label: "Detailed", desc: "In-depth paragraph breakdown" },
    { id: "bullets", label: "Bullets", desc: "Key ideas as bullet points" },
    { id: "takeaways", label: "Takeaways", desc: "Actionable insights" },
    { id: "timestamped", label: "Timestamped", desc: "Segmented by time chapters" },
    { id: "concepts", label: "Concepts", desc: "Core concepts explained" },
];

// ── Feature highlights ─────────────────────────────────────────────────────────
export const FEATURES = [
    { title: "12+ Languages", desc: "Summarize in English, Hindi, Spanish, French, Japanese & more." },
    { title: "6 Summary Formats", desc: "Short, detailed, bullets, takeaways, timestamped, or concepts." },
    { title: "Multi-Format Export", desc: "Download summaries as PDF, Markdown, or plain text files." },
    { title: "Transcript Search", desc: "Instantly search and highlight any word inside the full transcript." },
    { title: "Llama 3.3 + Groq", desc: "State-of-the-art AI summarization via Groq's blazing-fast API." },
    { title: "Video Metadata", desc: "Thumbnail, title, channel name, and duration at a glance." },
];
