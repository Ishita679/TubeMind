import { copyToClipboard, downloadFile, downloadMarkdown, downloadPdf } from "../utils/helpers";
import { LANGUAGES } from "../constants";
import { Copy, Download } from "lucide-react";

export default function ExportButtons({ content, title, transcript, summaryType, language, onToast }) {
    if (!content) return null;
    const langLabel = LANGUAGES.find((l) => l.code === language)?.label || language;
    const btn = "flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors text-[#55555f] hover:text-white";
    const s = { border: "1px solid rgba(255,255,255,0.07)" };

    const actions = [
        { label: "Copy", icon: <Copy size={11} />, fn: async () => { await copyToClipboard(content); onToast("Copied!", "success"); } },
        { label: "TXT", icon: <Download size={11} />, fn: () => { downloadFile(content, "summary.txt", "text/plain"); onToast("Downloaded TXT!", "success"); } },
        { label: "MD", icon: <Download size={11} />, fn: () => { downloadMarkdown(title, transcript, content, summaryType); onToast("Downloaded MD!", "success"); } },
        { label: "PDF", icon: <Download size={11} />, fn: () => { downloadPdf(title, content, summaryType, langLabel); onToast("PDF opened!", "success"); } },
    ];

    return (
        <div className="flex flex-wrap gap-1.5">
            {actions.map(({ label, icon, fn }) => (
                <button key={label} onClick={fn} className={btn} style={s}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    {icon}{label}
                </button>
            ))}
        </div>
    );
}
