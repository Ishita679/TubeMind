import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Info, AlertTriangle } from "lucide-react";

const CONFIG = {
    success: { Icon: Check, bg: "linear-gradient(135deg,#22c55e,#16a34a)" },
    error: { Icon: X, bg: "linear-gradient(135deg,#e63946,#c0392b)" },
    info: { Icon: Info, bg: "linear-gradient(135deg,#3b82f6,#2563eb)" },
    warning: { Icon: AlertTriangle, bg: "linear-gradient(135deg,#f59e0b,#d97706)" },
};

export default function ToastNotification({ toasts, onDismiss }) {
    return (
        <div
            aria-live="polite"
            className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none max-w-xs w-full"
        >
            <AnimatePresence>
                {toasts.map((t) => {
                    const { Icon, bg } = CONFIG[t.type] || CONFIG.info;
                    return (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.85 }}
                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl"
                            style={{
                                background: "#18181f",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                backdropFilter: "blur(12px)",
                            }}
                        >
                            <span
                                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: bg, boxShadow: t.type === "error" ? "0 2px 12px rgba(230,57,70,0.4)" : "none" }}
                            >
                                <Icon size={13} strokeWidth={2.5} className="text-white" />
                            </span>
                            <p className="flex-1 text-[13px] font-medium text-white">{t.message}</p>
                            <button
                                onClick={() => onDismiss(t.id)}
                                className="flex-shrink-0 transition-opacity"
                                style={{ color: "#44444e", opacity: 0.6 }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
