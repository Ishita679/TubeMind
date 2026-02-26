import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, RotateCcw, Zap } from "lucide-react";

import { useVideoProcessor } from "./hooks/useVideoProcessor";
import { useToast } from "./hooks/useToast";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoInfoCard from "./components/VideoInfoCard";
import TranscriptViewer from "./components/TranscriptViewer";
import SummaryPanel from "./components/SummaryPanel";
import Footer from "./components/Footer";
import ToastNotification from "./components/ToastNotification";
import Loader from "./components/Loader";

export default function App() {
  const { data, loading, error, process, reset } = useVideoProcessor();
  const { toasts, toast, dismiss } = useToast();
  const resultRef = useRef(null);

  /* Scroll to results after fetch */
  useEffect(() => {
    if (data && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [data]);

  useEffect(() => { if (data) toast("Video processed successfully!", "success"); }, [data]);  // eslint-disable-line
  useEffect(() => { if (error) toast(error, "error", 5000); }, [error]); // eslint-disable-line

  const handleReset = () => {
    reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Use real transcript from backend; fall back to synthesised text only if missing */
  const transcript = data?.transcript || (data?.summary ? buildTranscript(data) : null);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ToastNotification toasts={toasts} onDismiss={dismiss} />
      <Navbar />

      <main>
        <HeroSection onFetch={process} loading={loading} hasResult={!!(data || loading || error)} />

        {/* ── Loading ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 pb-12"
            >
              <div
                className="rounded-2xl p-12 flex flex-col items-center gap-6"
                style={{ background: "#11111a", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Animated icon */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#e63946,#c0392b)",
                      boxShadow: "0 8px 32px rgba(230,57,70,0.4)",
                    }}
                  >
                    <Loader size="md" />
                  </div>
                  {/* pulse ring */}
                  <div
                    className="absolute -inset-2 rounded-2xl -z-10 ring"
                    style={{ border: "1px solid rgba(230,57,70,0.2)" }}
                  />
                </div>

                <div className="text-center">
                  <p className="font-bold text-[16px] text-white mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Processing your video…
                  </p>
                  <p className="text-[14px]" style={{ color: "#55555f" }}>
                    Fetching transcript · extracting metadata · generating AI summary
                  </p>
                </div>

                {/* Step pills */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {["Fetching video", "Extracting transcript", "Generating summary"].map((step) => (
                    <div
                      key={step}
                      className="text-[12px] px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: "rgba(230,57,70,0.07)",
                        border: "1px solid rgba(230,57,70,0.15)",
                        color: "#e63946",
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto px-6 pb-6"
            >
              <div
                className="flex items-center gap-3 p-4 rounded-2xl text-[13px]"
                style={{
                  background: "rgba(230,57,70,0.08)",
                  border: "1px solid rgba(230,57,70,0.2)",
                  color: "#e63946",
                }}
              >
                <X size={15} className="flex-shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  onClick={handleReset}
                  className="text-[12px] underline hover:no-underline opacity-70 flex-shrink-0"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {data && !loading && (
            <motion.section
              key="results"
              ref={resultRef}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto px-6 pb-16"
            >
              {/* Status bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: "#e63946" }}>
                  <CheckCircle2 size={15} />
                  Video processed
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg
                    transition-colors"
                  style={{ color: "#55555f", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#55555f"; e.currentTarget.style.background = "transparent"; }}
                >
                  <RotateCcw size={12} />
                  Clear & Reset
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <VideoInfoCard meta={{ videoId: data.videoId, title: data.title, channel: data.channel, durationSeconds: data.durationSeconds, thumbnail: data.thumbnail }} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TranscriptViewer transcript={transcript} onToast={toast} />
                  <SummaryPanel summaryData={data.summary} transcript={transcript} videoTitle={data.title} onToast={toast} />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

/* Build a readable text from summary data (backend doesn't return raw transcript yet) */
function buildTranscript(data) {
  if (!data?.summary) return null;
  const { detailedSummary, chapters, keyConcepts } = data.summary;
  const parts = [];
  if (detailedSummary) parts.push(`=== SUMMARY ===\n\n${detailedSummary}`);
  if (chapters?.length) parts.push(`\n=== CHAPTERS ===\n\n` + chapters.map((c) => `[${fmtSec(c.startSeconds)}] ${c.title}`).join("\n"));
  if (keyConcepts?.length) parts.push(`\n=== KEY CONCEPTS ===\n\n` + keyConcepts.map((c) => `• ${c.name}: ${c.explanation}`).join("\n"));
  return parts.join("\n\n") || "Transcript not available.";
}

function fmtSec(s) {
  const m = Math.floor((s % 3600) / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}