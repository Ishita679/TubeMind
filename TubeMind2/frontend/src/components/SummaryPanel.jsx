import { useState } from "react";
import { Copy, Download, FileText, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SUMMARY_TYPES } from "../constants";
import { wordCount, downloadFile, downloadMarkdown, downloadPdf, copyToClipboard } from "../utils/helpers";
import Loader from "./Loader";

export default function SummaryPanel({ summaryData, transcript, videoTitle, onToast }) {
    const [activeType, setActiveType] = useState("short");

    if (!summaryData) {
        return (
            <div className="bg-[#11111a] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[400px]">
                {transcript ? (
                    <Loader label="Generating AI Summary..." />
                ) : (
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto opacity-20">
                            <Zap size={20} className="text-white" />
                        </div>
                        <p className="text-white font-semibold text-sm">AI Summary Blocked</p>
                        <p className="text-[#33333e] text-xs max-w-[250px]">
                            Transcript extraction failed, so AI cannot analyze this video. Try a video with manual captions.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    const getContent = (type) => {
        switch (type) {
            case "short": return summaryData.shortSummary;
            case "detailed": return summaryData.detailedSummary;
            case "bullets": return summaryData.keyConcepts.map(c => `• ${c.name}: ${c.explanation}`).join("\n");
            case "timestamped": return summaryData.chapters.map(ch => `[${fmtSec(ch.startSeconds)}] ${ch.title}`).join("\n");
            case "concepts": return summaryData.keyConcepts.map(c => `${c.name}\n${c.explanation}`).join("\n\n");
            default: return "";
        }
    };

    const activeContent = getContent(activeType);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#11111a] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
        >
            <div className="p-4 border-b border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Zap size={16} color="#e63946" strokeWidth={3} />
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">AI Analysis</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {SUMMARY_TYPES.map(t => (
                        <button
                            key={t.id} onClick={() => setActiveType(t.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeType === t.id ? "bg-[#e6394622] text-[#e63946] border border-[#e6394644]" : "text-[#55555f] hover:text-white"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto max-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeType} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[#9999b0] text-sm leading-relaxed whitespace-pre-wrap"
                    >
                        {activeContent}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button onClick={() => { copyToClipboard(activeContent); onToast("Copied Summary!"); }} className="p-2 rounded-lg hover:bg-white/5 transition-all text-[#55555f] hover:text-white"><Copy size={14} /></button>
                    <button onClick={() => downloadFile(activeContent, "summary.txt", "text/plain")} className="p-2 rounded-lg hover:bg-white/5 transition-all text-[#55555f] hover:text-white"><Download size={14} /></button>
                </div>
                <div className="text-[10px] text-[#33333e] font-mono">{wordCount(activeContent)} WORDS</div>
            </div>
        </motion.div>
    );
}

function fmtSec(s) {
    const m = Math.floor(s / 60);
    const rs = Math.floor(s % 60);
    return `${m}:${rs.toString().padStart(2, "0")}`;
}
