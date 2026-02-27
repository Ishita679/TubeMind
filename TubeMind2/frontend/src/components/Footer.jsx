export default function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-white/5 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="font-bold text-lg">Tube<span className="text-[#e63946]">Mind</span></span>
                    <p className="text-[#33333e] text-xs">© 2026 TubeMind AI. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
