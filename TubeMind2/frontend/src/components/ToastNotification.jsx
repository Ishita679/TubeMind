import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function ToastNotification({ toasts, onDismiss }) {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-[#11111a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[280px]"
                    >
                        {t.type === "success" && <CheckCircle size={18} color="#22c55e" />}
                        {t.type === "error" && <AlertCircle size={18} color="#ef4444" />}
                        {t.type === "info" && <Info size={18} color="#e63946" />}

                        <p className="text-sm font-medium text-white flex-1">{t.message}</p>

                        <button onClick={() => onDismiss(t.id)} className="text-[#33333e] hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
