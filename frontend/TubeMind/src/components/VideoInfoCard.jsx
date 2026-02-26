import { motion } from "framer-motion";
import { ExternalLink, Clock, Tv2 } from "lucide-react";
import { formatDuration } from "../utils/helpers";

export default function VideoInfoCard({ meta }) {
    if (!meta) return null;
    const { videoId, title, channel, durationSeconds, thumbnail } = meta;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden flex flex-col sm:flex-row"
            style={{ background: "#11111a", border: "1px solid rgba(255,255,255,0.07)" }}
        >
            {/* Thumbnail */}
            <div className="sm:w-48 flex-shrink-0 relative group overflow-hidden bg-[#0a0a10]">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-40 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://placehold.co/480x270/18181f/e63946?text=No+Thumbnail"; }}
                />
                {durationSeconds > 0 && (
                    <span
                        className="absolute bottom-2 right-2 text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: "rgba(0,0,0,0.85)" }}
                    >
                        {formatDuration(durationSeconds)}
                    </span>
                )}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
            flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center pl-0.5"
                        style={{ background: "rgba(230,57,70,0.9)", boxShadow: "0 4px 20px rgba(230,57,70,0.5)" }}
                    >
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 p-5 flex flex-col justify-center gap-2.5">
                <div className="flex items-center gap-1.5">
                    <Tv2 size={12} style={{ color: "#e63946" }} />
                    <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: "#e63946" }}
                    >
                        {channel}
                    </span>
                </div>

                <h3
                    className="font-semibold text-[15px] leading-snug clamp-2 text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {title}
                </h3>

                <div className="flex flex-wrap gap-2">
                    {durationSeconds > 0 && (
                        <span
                            className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-lg font-medium"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#8888a0" }}
                        >
                            <Clock size={11} />{formatDuration(durationSeconds)}
                        </span>
                    )}
                    <a
                        href={`https://youtube.com/watch?v=${videoId}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] px-2.5 py-1 rounded-lg font-medium
              transition-all duration-150"
                        style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", border: "1px solid rgba(230,57,70,0.2)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(230,57,70,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(230,57,70,0.1)"}
                    >
                        <ExternalLink size={11} />
                        Watch on YouTube
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
