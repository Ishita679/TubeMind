import { motion } from "framer-motion";

export default function Loader({ size = "md", label }) {
    const sz = {
        sm: "w-4 h-4 border-2",
        md: "w-7 h-7 border-2",
        lg: "w-10 h-10 border-[3px]",
        xl: "w-14 h-14 border-[3px]"
    };
    return (
        <div className="flex flex-col items-center justify-center gap-2.5">
            <motion.div
                className={`${sz[size]} rounded-full`}
                style={{ borderColor: "rgba(230,57,70,0.2)", borderTopColor: "#e63946" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
            />
            {label && <p className="text-[12px] font-medium" style={{ color: "#55555f" }}>{label}</p>}
        </div>
    );
}
