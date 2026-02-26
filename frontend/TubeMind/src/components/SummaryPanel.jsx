import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, FileText } from "lucide-react";
import { SUMMARY_TYPES } from "../constants";
import { wordCount } from "../utils/helpers";
import LanguageSelector from "./LanguageSelector";
import ExportButtons from "./ExportButtons";
import Loader from "./Loader";

export default function SummaryPanel({ summaryData, transcript, videoTitle, onToast }) {
    const [activeType, setActiveType] = useState("short");
    const [language, setLanguage] = useState("en");

    const getText = (id) => {
        if (!summaryData) return "";
        switch (id) {
            case "short": return summaryData.shortSummary || "";
            case "detailed": return summaryData.detailedSummary || "";
            case "bullets": return fmtBullets(summaryData.keyConcepts, summaryData.detailedSummary);
            case "takeaways": return fmtTakeaways(summaryData.keyConcepts);
            case "timestamped": return fmtTimestamped(summaryData.chapters);
            case "concepts": return fmtConcepts(summaryData.keyConcepts);
            default: return summaryData.shortSummary || "";
        }
    };

    const activeText = getText(activeType);
    const activeLabel = SUMMARY_TYPES.find((t) => t.id === activeType)?.label || activeType;

    const renderContent = () => {
        if (!summaryData) return null;

        if (activeType === "timestamped" && summaryData.chapters?.length) {
            return (
                <div className="space-y-3">
                    {summaryData.chapters.map((ch, i) => (
                        <div key={i} className="flex gap-3">
                            <span className="flex-shrink-0 text-[11px] font-mono pt-0.5" style={{ color: "#e63946" }}>
                                {fmtSec(ch.startSeconds)}
                            </span>
                            <div>
                                <p className="text-[13px] font-medium text-white">{ch.title}</p>
                                <p className="text-[11px]" style={{ color: "#44444e" }}>ends {fmtSec(ch.endSeconds)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (activeType === "concepts" && summaryData.keyConcepts?.length) {
            return (
                <div className="space-y-3">
                    {summaryData.keyConcepts.map((c, i) => (
                        <div
                            key={i}
                            className="p-3 rounded-xl"
                            style={{ background: "rgba(230,57,70,0.05)", border: "1px solid rgba(230,57,70,0.12)" }}
                        >
                            <p
                                className="text-[12px] font-semibold mb-1"
                                style={{ color: "#e63946", fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {c.name}
                            </p>
                            <p className="text-[12px] leading-relaxed" style={{ color: "#8888a0" }}>{c.explanation}</p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "#9999b0" }}>
                {activeText}
            </p>
        );
    };

    const card = { background: "#11111a", border: "1px solid rgba(255,255,255,0.07)" };
    const div = { height: "1px", background: "rgba(255,255,255,0.05)" };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="rounded-2xl flex flex-col overflow-hidden"
            style={card}
        >
            {/* Header */}
            <div className="px-4 py-3.5 flex-shrink-0 space-y-3">
                {/* Title + language */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                        <Zap size={13} style={{ color: "#e63946" }} />
                        <h2 className="font-semibold text-[13px] text-white">AI Summary</h2>
                    </div>
                    <LanguageSelector value={language} onChange={setLanguage} />
                </div>

                {/* Language note */}
                <AnimatePresence>
                    {language !== "en" && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] px-2.5 py-1.5 rounded-lg"
                            style={{ background: "rgba(230,57,70,0.07)", border: "1px solid rgba(230,57,70,0.18)", color: "#e63946" }}
                        >
                            Summaries are in English — multi-language support coming soon!
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Type tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {SUMMARY_TYPES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveType(t.id)}
                            title={t.desc}
                            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg
                transition-all duration-150"
                            style={activeType === t.id
                                ? { background: "rgba(230,57,70,0.15)", border: "1px solid rgba(230,57,70,0.35)", color: "#e63946" }
                                : { background: "transparent", border: "1px solid rgba(255,255,255,0.07)", color: "#55555f" }
                            }
                            onMouseEnter={e => { if (activeType !== t.id) { e.currentTarget.style.color = "#aaaabc"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; } }}
                            onMouseLeave={e => { if (activeType !== t.id) { e.currentTarget.style.color = "#55555f"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; } }}
                        >

                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div style={div} />

            {/* Body */}
            <div className="p-4 flex flex-col gap-3 flex-1 min-h-0">
                {!summaryData ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <Loader size="md" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeType}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-3 flex-1"
                        >
                            {/* Export row */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <ExportButtons
                                    content={activeText} title={videoTitle} transcript={transcript}
                                    summaryType={activeLabel} language={language} onToast={onToast}
                                />
                                {activeText && (
                                    <span className="text-[11px]" style={{ color: "#33333e" }}>
                                        {wordCount(activeText)} words
                                    </span>
                                )}
                            </div>

                            {/* Content box */}
                            {activeText || summaryData ? (
                                <div
                                    className="overflow-y-auto h-52 p-3 rounded-xl"
                                    style={{ background: "rgba(255,255,255,0.02)" }}
                                >
                                    {renderContent()}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-52 gap-2" style={{ color: "#33333e" }}>
                                    <FileText size={28} strokeWidth={1.2} />
                                    <p className="text-[12px]">No data for this format</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
}

/* ── helpers ── */
function fmtSec(s) {
    const m = Math.floor((s % 3600) / 60);
    return `${m}:${String(s % 60).padStart(2, "0")}`;
}
function fmtBullets(kc, detailed) {
    if (kc?.length) return kc.map((c) => `- ${c.name}: ${c.explanation}`).join("\n");
    return (detailed || "").split(/\n+/).filter(Boolean).map((l) => `- ${l.trim()}`).join("\n");
}
function fmtTakeaways(kc) {
    return (kc || []).map((c) => `${c.name}\n   ${c.explanation}`).join("\n\n");
}
function fmtTimestamped(chapters) {
    return chapters?.length ? chapters.map((ch) => `[${fmtSec(ch.startSeconds)}] ${ch.title}`).join("\n") : "No chapter data.";
}
function fmtConcepts(kc) {
    return (kc || []).map((c) => `${c.name}\n${c.explanation}`).join("\n\n");
}
