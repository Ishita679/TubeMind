import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Copy, Download, Check, X, FileText } from "lucide-react";
import { copyToClipboard, downloadFile, wordCount, readingTime, sentenceCount } from "../utils/helpers";

function highlightText(text, query) {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
}

export default function TranscriptViewer({ transcript, onToast }) {
    const [search, setSearch] = useState("");
    const [copied, setCopied] = useState(false);

    if (!transcript) return null;

    const words = wordCount(transcript);
    const sentences = sentenceCount(transcript);
    const time = readingTime(transcript);

    const matchCount = useMemo(() => {
        if (!search.trim()) return 0;
        const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return (transcript.match(new RegExp(escaped, "gi")) || []).length;
    }, [transcript, search]);

    const handleCopy = async () => {
        await copyToClipboard(transcript);
        setCopied(true);
        onToast("Transcript copied!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        downloadFile(transcript, "transcript.txt", "text/plain");
        onToast("Downloaded!", "success");
    };

    const rendered = useMemo(() => highlightText(transcript, search), [transcript, search]);

    const card = { background: "#11111a", border: "1px solid rgba(255,255,255,0.07)" };
    const divider = { height: "1px", background: "rgba(255,255,255,0.05)", margin: "0" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl flex flex-col overflow-hidden"
            style={card}
        >
            {/* Header */}
            <div className="px-4 py-3.5 flex-shrink-0">
                {/* Title row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <FileText size={13} style={{ color: "#e63946" }} />
                            <h2 className="font-semibold text-[13px] text-white">Transcript</h2>
                        </div>
                        <p className="text-[11px]" style={{ color: "#44444e" }}>
                            {words.toLocaleString()} words · {sentences} sentences · {time} read
                        </p>
                    </div>
                    <div className="flex gap-1.5">
                        <SmallBtn onClick={handleCopy}>
                            {copied ? <Check size={12} style={{ color: "#4ade80" }} /> : <Copy size={12} />}
                            <span>{copied ? "Copied!" : "Copy"}</span>
                        </SmallBtn>
                        <SmallBtn onClick={handleDownload}>
                            <Download size={12} />
                            <span>TXT</span>
                        </SmallBtn>
                    </div>
                </div>

                {/* Search */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <Search size={12} style={{ opacity: 0.4, flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search in transcript…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none flex-1 text-white placeholder:text-[#33333e]"
                        style={{ caretColor: "#e63946" }}
                    />
                    <AnimatePresence>
                        {search && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-1.5">
                                {matchCount > 0 && (
                                    <span className="text-[11px] font-medium" style={{ color: "#e63946" }}>{matchCount}</span>
                                )}
                                <button onClick={() => setSearch("")} style={{ opacity: 0.4 }} className="hover:opacity-80 transition-opacity">
                                    <X size={11} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Divider */}
            <div style={divider} />

            {/* Body */}
            <div
                className="p-4 overflow-y-auto text-[12px] sm:text-[13px] leading-relaxed
          whitespace-pre-wrap font-mono h-64 flex-1"
                style={{ color: "#6666780" }}
            >
                {typeof rendered === "string" ? rendered : <>{rendered}</>}
            </div>
        </motion.div>
    );
}

function SmallBtn({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg
        transition-colors text-[#55555f] hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
            {children}
        </button>
    );
}
