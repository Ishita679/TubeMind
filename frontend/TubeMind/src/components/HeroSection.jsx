import { Globe, Languages, Download, Search, Cpu, Film } from "lucide-react";

// Icon map — matches FEATURES by title
const ICON_MAP = {
    "12+ Languages": <Globe size={16} style={{ color: "#e63946" }} />,
    "6 Summary Formats": <Languages size={16} style={{ color: "#e63946" }} />,
    "Multi-Format Export": <Download size={16} style={{ color: "#e63946" }} />,
    "Transcript Search": <Search size={16} style={{ color: "#e63946" }} />,
    "Llama 3.3 + Groq": <Cpu size={16} style={{ color: "#e63946" }} />,
    "Video Metadata": <Film size={16} style={{ color: "#e63946" }} />,
};

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Youtube, X, ClipboardPaste } from "lucide-react";
import { FEATURES } from "../constants";
import { isValidYouTubeUrl } from "../utils/helpers";
import Loader from "./Loader";

/* Orb */
function Orb({ style, className }) {
    return <div className={`absolute rounded-full pointer-events-none select-none ${className}`} style={style} aria-hidden />;
}

/* Feature card */
function FeatureCard({ title, desc, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-5 cursor-default transition-all duration-200 hover:-translate-y-1"
            style={{ background: "#11111a", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(230,57,70,0.28)"; e.currentTarget.style.background = "#18181f"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.background = "#11111a"; }}
        >
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3.5"
                style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.15)" }}
            >
                {ICON_MAP[title]}
            </div>
            <h3 className="font-semibold text-[14px] text-white mb-1.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {title}
            </h3>
            <p className="text-[13px] leading-relaxed" style={{ color: "#55555f" }}>{desc}</p>
        </motion.div>
    );
}

export default function HeroSection({ onFetch, loading, hasResult }) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) { setError("Please enter a YouTube URL."); return; }
        if (!isValidYouTubeUrl(trimmed)) { setError("Enter a valid YouTube URL (youtube.com or youtu.be)."); return; }
        setError("");
        onFetch(trimmed);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) { setUrl(text); setError(""); }
        } catch { /* unavailable */ }
    };

    return (
        <section id="hero">
            <div className="relative overflow-hidden">
                {/* Orbs */}
                <Orb className="w-[600px] h-[600px] orb-a"
                    style={{ background: "radial-gradient(circle, rgba(230,57,70,0.18) 0%, transparent 70%)", filter: "blur(80px)", top: "-180px", left: "50%", transform: "translateX(-50%)" }} />
                <Orb className="w-[400px] h-[400px] orb-b"
                    style={{ background: "radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)", filter: "blur(60px)", top: "40px", right: "-100px" }} />

                <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-14 text-center">

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-bold leading-[1.15] mb-5 text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(30px, 5.5vw, 52px)" }}
                    >
                        Summarize YouTube videos{" "}
                        <span className="shimmer-red">instantly</span>
                        {" "}in any language.
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13, duration: 0.45 }}
                        className="text-[15px] leading-relaxed max-w-lg mx-auto mb-10"
                        style={{ color: "#8888a0" }}
                    >
                        Paste a YouTube URL, get the full transcript, and generate AI-powered
                        summaries — short, detailed, bullet points, or timestamped.
                    </motion.p>

                    {/* URL Input */}
                    <motion.form
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19, duration: 0.45 }}
                        onSubmit={handleSubmit} className="max-w-xl mx-auto" noValidate
                    >
                        <div className="rounded-2xl p-1.5"
                            style={{ background: "#11111a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>

                            {/* Input row */}
                            <div className="flex items-center gap-2.5 px-3 py-2.5">
                                <Youtube size={16} style={{ color: "#44444e", flexShrink: 0 }} />
                                <input
                                    ref={inputRef}
                                    id="youtube-url-input"
                                    type="url"
                                    value={url}
                                    onChange={(e) => { setUrl(e.target.value); setError(""); }}
                                    placeholder="Paste YouTube URL here..."
                                    autoComplete="off"
                                    className="flex-1 text-[14px] bg-transparent outline-none text-white placeholder:text-[#33333e]"
                                    style={{ caretColor: "#e63946" }}
                                />
                                <AnimatePresence>
                                    {url && (
                                        <motion.button type="button"
                                            onClick={() => { setUrl(""); setError(""); inputRef.current?.focus(); }}
                                            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                            className="flex-shrink-0 p-0.5 transition-colors" style={{ color: "#44444e" }}
                                            onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
                                            onMouseLeave={e => e.currentTarget.style.color = "#44444e"}
                                        >
                                            <X size={13} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Divider */}
                            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 4px" }} />

                            {/* Button row */}
                            <div className="flex gap-2 p-1">
                                <button type="button" onClick={handlePaste}
                                    className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium
                    py-2 rounded-xl transition-colors"
                                    style={{ color: "#55555f" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#8888a0"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#55555f"; }}
                                >
                                    <ClipboardPaste size={13} />
                                    Paste
                                </button>

                                <button type="submit" disabled={loading}
                                    className="flex-[2.5] flex items-center justify-center gap-2 text-[13px] font-semibold
                    py-2 rounded-xl text-white transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: "linear-gradient(135deg, #e63946, #c0392b)", boxShadow: "0 4px 20px rgba(230,57,70,0.35)" }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 28px rgba(230,57,70,0.5)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(230,57,70,0.35)"; }}
                                >
                                    {loading ? <Loader size="sm" /> : <Zap size={14} className="fill-white" />}
                                    {loading ? "Processing..." : "Get Transcript"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="mt-2.5 text-[12px] flex items-center gap-1.5" style={{ color: "#e63946" }} role="alert">
                                    <X size={12} /> {error}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.form>

                    {/* Pills */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-2 mt-8">
                        {["12+ Languages", "6 Summary Formats", "PDF & MD Export", "Search Transcript", "Timestamped View"].map((label) => (
                            <span key={label} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#44444e" }}>
                                {label}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Feature grid */}
            {!hasResult && (
                <div className="max-w-5xl mx-auto px-6 pb-24">
                    <p className="text-[11px] font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: "#33333e" }}>
                        What TubeMind does
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {FEATURES.map((f, i) => (
                            <FeatureCard key={f.title} {...f} index={i} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
