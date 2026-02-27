import { motion } from "framer-motion";
import { FileText, Search, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "../utils/helpers";

export default function TranscriptViewer({ transcript, transcriptError, onToast }) {
    const [search, setSearch] = useState("");

    const paragraphs = transcript ? transcript.split("\n\n") : [];
    const filtered = paragraphs.filter(p => p.toLowerCase().includes(search.toLowerCase()));

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-[#11111a] border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full"
        >
            <div className="p-4 border-b border-white/5 space-y-4">
                <div className="flex items-center gap-2">
                    <FileText size={16} color="#44444e" />
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">Full Transcript</h3>
                </div>
                <div className="relative">
                    <input
                        type="text" placeholder="Search in transcript..." value={search} onChange={e => setSearch(e.target.value)}
                        disabled={!transcript}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-9 py-2 text-xs text-white outline-none focus:border-[#e6394644] transition-all disabled:opacity-30"
                    />
                </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto max-h-[500px] font-mono text-[13px] leading-relaxed text-[#55555f]">
                {transcript ? (
                    filtered.length > 0 ? (
                        filtered.map((p, i) => (
                            <p key={i} className="mb-4 hover:text-[#8888a0] transition-all">{p}</p>
                        ))
                    ) : (
                        <p className="text-center italic opacity-30 mt-10">No matches found for "{search}"</p>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                        <div className="w-12 h-12 bg-[#e6394611] rounded-full flex items-center justify-center border border-[#e6394622]">
                            <FileText size={20} className="text-[#e63946]" />
                        </div>
                        <p className="text-white font-semibold text-sm">Transcript Unavailable</p>
                        <p className="text-[#33333e] text-xs max-w-[180px]">
                            {transcriptError || "YouTube has restricted access to this transcript. Try again in a few minutes or use a different video."}
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/5">
                <button
                    disabled={!transcript}
                    onClick={() => { copyToClipboard(transcript); onToast("Transcript Copied!"); }}
                    className="w-full py-2 rounded-xl bg-white/5 text-[#55555f] text-xs font-semibold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-20"
                >
                    <Copy size={12} /> Copy Full Transcript
                </button>
            </div>
        </motion.div>
    );
}
