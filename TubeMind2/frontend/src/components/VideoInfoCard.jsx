import { motion } from "framer-motion";
import { Youtube, User, Clock, Hash, AlignLeft } from "lucide-react";

export default function VideoInfoCard({ meta }) {
    if (!meta) return null;

    // Truncate description for the card
    const truncate = (str, n) => {
        if (!str) return "";
        return str.length > n ? str.substr(0, n - 1) + "..." : str;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#11111a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
            <div className="flex flex-col md:flex-row">
                {/* Thumbnail Section */}
                <div className="md:w-72 lg:w-80 shrink-0 relative group bg-black flex items-center justify-center border-r border-white/5">
                    <img
                        src={meta.thumbnail}
                        alt={meta.title}
                        className="w-full h-full object-contain aspect-video"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Youtube color="#e63946" size={48} fill="#e63946" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-0.5 rounded bg-[#e6394622] text-[#e63946] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                <Hash size={10} /> {meta.videoId}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight font-space tracking-tight">
                            {meta.title}
                        </h2>

                        {meta.description && (
                            <div className="flex gap-2">
                                <AlignLeft size={14} className="text-[#44444e] mt-1 shrink-0" />
                                <p className="text-[#8888a0] text-sm leading-relaxed italic">
                                    {truncate(meta.description, 180)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <User size={14} className="text-[#e63946]" />
                            <span className="text-white text-sm font-semibold">{meta.channel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-[#e63946]" />
                            <span className="text-[#e63946] text-sm font-mono font-bold">{meta.duration || "0:00"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
