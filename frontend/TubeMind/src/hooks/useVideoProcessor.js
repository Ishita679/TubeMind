import { useState, useCallback } from "react";
import { processVideoAPI } from "../utils/api";

/**
 * Custom hook that manages the full video-processing pipeline.
 * 
 * NO dummy-data fallback — if the backend fails, we surface the real
 * error so the user knows exactly what went wrong (no captions,
 * server down, invalid URL, etc.)
 */
export function useVideoProcessor() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const process = useCallback(async (url) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await processVideoAPI(url);
            setData(result);
        } catch (err) {
            // Surface the real backend error message to the user
            setError(err.message || "Failed to process video. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, process, reset };
}
