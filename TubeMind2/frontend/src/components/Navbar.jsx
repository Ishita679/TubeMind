import { Zap } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="relative z-50 border-b border-white/5 bg-[#09090b/80] backdrop-blur-md px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#e63946] rounded-lg">
                        <Zap size={18} color="white" fill="white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Tube<span className="text-[#e63946]">Mind</span>
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#55555f]">
                    <a href="https://github.com" target="_blank" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </nav>
    );
}
