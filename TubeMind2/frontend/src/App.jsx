import React, { useEffect } from "react";
import { useVideoProcessor } from "./hooks/useVideoProcessor";
import { useToast } from "./hooks/useToast";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import VideoInfoCard from "./components/VideoInfoCard";
import SummaryPanel from "./components/SummaryPanel";
import TranscriptViewer from "./components/TranscriptViewer";
import Footer from "./components/Footer";
import ToastNotification from "./components/ToastNotification";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
    const { data, loading, error, process } = useVideoProcessor();
    const { toasts, toast, dismiss } = useToast();

    useEffect(() => {
        if (error) {
            toast(error, "error");
        }
    }, [error, toast]);

    const hasResult = !!data;

    return (
        <div className="min-h-screen flex flex-col selection:bg-[#e6394633] selection:text-[#e63946]">
            <Navbar />

            <main className="flex-1">
                <HeroSection
                    onFetch={process}
                    loading={loading}
                    hasResult={hasResult}
                />

                <AnimatePresence>
                    {hasResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            className="max-w-6xl mx-auto px-6 pb-24 space-y-12"
                        >
                            <VideoInfoCard meta={data} />

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                                <div className="lg:col-span-3">
                                    <SummaryPanel
                                        summaryData={data.summary}
                                        transcript={data.transcript}
                                        videoTitle={data.title}
                                        onToast={toast}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <TranscriptViewer
                                        transcript={data.transcript}
                                        transcriptError={data.transcriptError}
                                        onToast={toast}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            <ToastNotification toasts={toasts} onDismiss={dismiss} />
        </div>
    );
}
