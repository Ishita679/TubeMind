import { motion } from "framer-motion";
import { Zap, Heart, Github, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#08080e" }}>
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

                    {/* Brand */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg,#e63946,#c0392b)", boxShadow: "0 4px 16px rgba(230,57,70,0.35)" }}
                            >
                                <Zap size={13} className="text-white fill-white" />
                            </div>
                            <span
                                className="font-bold text-[16px] text-white"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                Tube<span style={{ color: "#e63946" }}>Mind</span>
                            </span>
                        </div>
                        <p className="text-[12px] max-w-[200px] leading-relaxed" style={{ color: "#44444e" }}>
                            AI-powered YouTube transcript summariser.
                        </p>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col gap-2">
                        {[
                            { label: "About", href: "#hero", icon: null },
                            { label: "GitHub", href: "https://github.com/Ishita679/TubeMind", icon: <Github size={12} /> },
                        ].map(({ label, href, icon }) => (
                            <motion.a
                                key={label} href={href} whileHover={{ x: 3 }}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-[13px] w-fit transition-colors"
                                style={{ color: "#44444e" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#e63946"}
                                onMouseLeave={e => e.currentTarget.style.color = "#44444e"}
                            >
                                {icon}{label}
                            </motion.a>
                        ))}
                    </nav>

                </div>
            </div>
        </footer>
    );
}
