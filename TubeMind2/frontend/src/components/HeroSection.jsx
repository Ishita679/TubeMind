import { Globe, Youtube, Zap, Search, Download, Cpu, Film, X, ClipboardPaste } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FEATURES } from "../constants";
import { isValidYouTubeUrl } from "../utils/helpers";
import Loader from "./Loader";

const ICON_MAP = {
    "12+ Languages": <Globe size={16} color="#e63946" />,
    "6 Summary Formats": <Search size={16} color="#e63946" />,
    "Multi-Format Export": <Download size={16} color="#e63946" />,
    "Transcript Search": <Search size={16} color="#e63946" />,
    "Llama 3.3 + Groq": <Cpu size={16} color="#e63946" />,
    "Video Metadata": <Film size={16} color="#e63946" />,
};

export default function HeroSection({ onFetch, loading, hasResult }) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) { setError("Please enter a URL."); return; }
        if (!isValidYouTubeUrl(url)) { setError("Invalid YouTube URL."); return; }
        setError("");
        onFetch(url);
    };

    return (
        <section className="relative overflow-hidden py-16 md:py-24">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(230,57,70,0.15)_0%,transparent_70%)] blur-[80px] orb-a pointer-events-none" />
            <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(192,57,43,0.1)_0%,transparent_70%)] blur-[60px] orb-b pointer-events-none" />

            <div className="relative max-w-4xl mx-auto px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Summarize YouTube videos <span className="shimmer-red">instantly</span> in any language.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-lg text-[#8888a0] mb-10 max-w-2xl mx-auto"
                >
                    Paste a YouTube URL, get the full transcript, and generate AI-powered summaries — short, detailed, or timestamped.
                </motion.p>

                <motion.form
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-16"
                >
                    <div className="bg-[#11111a] border border-white/10 rounded-2xl p-2 flex flex-col items-stretch gap-2 shadow-2xl">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <Youtube size={20} color="#44444e" />
                            <input
                                ref={inputRef}
                                type="text" value={url} onChange={e => setUrl(e.target.value)}
                                placeholder="Paste YouTube link here..."
                                className="bg-transparent border-none outline-none text-white flex-1 placeholder:text-[#33333e]"
                            />
                            {url && <X size={16} color="#44444e" className="cursor-pointer" onClick={() => setUrl("")} />}
                        </div>
                        <div className="h-[1px] bg-white/5 mx-2" />
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={async () => { setUrl(await navigator.clipboard.readText()); }}
                                className="flex-1 py-2.5 rounded-xl bg-white/5 text-[#55555f] text-sm font-medium hover:bg-white/10 hover:text-white transition-all"
                            >
                                <ClipboardPaste size={14} className="inline mr-2" /> Paste
                            </button>
                            <button
                                type="submit" disabled={loading}
                                className="flex-[2] py-2.5 rounded-xl bg-gradient-to-br from-[#e63946] to-[#c0392b] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(230,57,70,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader size="sm" /> : <Zap size={14} className="inline mr-2 fill-white" />}
                                {loading ? "Processing..." : "Get Transcript"}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-[#e63946] text-xs mt-3">{error}</p>}
                </motion.form>

                {!hasResult && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {FEATURES.map((f, i) => (
                            <div key={i} className="bg-[#11111a] border border-white/5 p-5 rounded-2xl text-left hover:border-[#e6394633] transition-all">
                                <div className="p-2 bg-[#e6394611] border border-[#e6394622] rounded-lg w-fit mb-4">
                                    {ICON_MAP[f.title]}
                                </div>
                                <h3 className="text-white font-semibold text-sm mb-2">{f.title}</h3>
                                <p className="text-[#55555f] text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
