import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Zap } from "lucide-react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full transition-all duration-300"
            style={{
                background: scrolled ? "rgba(8,8,16,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(16px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.5)" : "none",
            }}
        >
            <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">

                {/* Logo */}
                <a href="#hero" className="flex items-center gap-2.5 select-none group">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center ring"
                        style={{
                            background: "linear-gradient(135deg, #e63946, #c0392b)",
                            boxShadow: "0 4px 16px rgba(230,57,70,0.4)",
                        }}
                    >
                        <Zap size={15} className="text-white fill-white" />
                    </div>
                    <span
                        className="font-bold text-[18px] tracking-tight text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        Tube<span style={{ color: "#e63946" }}>Mind</span>
                    </span>
                </a>

                {/* Right */}
                <div className="flex items-center gap-1">
                    <a
                        href="https://github.com/Ishita679/TubeMind"
                        target="_blank" rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium
              px-3 py-1.5 rounded-lg transition-colors text-[#8888a0] hover:text-white"
                        style={{ background: "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                        <Github size={14} />
                        GitHub
                    </a>

                </div>
            </div>
        </motion.nav>
    );
}
