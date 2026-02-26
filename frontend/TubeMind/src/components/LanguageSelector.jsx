import { Globe } from "lucide-react";
import { LANGUAGES } from "../constants";

export default function LanguageSelector({ value, onChange }) {
    return (
        <div className="flex items-center gap-1.5">
            <Globe size={12} style={{ color: "#44444e" }} />
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="text-[12px] font-medium pl-2.5 pr-6 py-1 rounded-lg appearance-none
            outline-none cursor-pointer transition-colors text-white"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                    style={{ color: "#44444e" }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </div>
    );
}
