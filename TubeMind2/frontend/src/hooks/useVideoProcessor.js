import { useState, useCallback } from "react";
import { processVideoAPI } from "../utils/api";

export function useVideoProcessor() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const process = useCallback(async (url) => {
        setLoading(true);
        setError(null);
        try {
            const result = await processVideoAPI(url);
            setData(result);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = () => { setData(null); setError(null); setLoading(false); };

    return { data, loading, error, process, reset };
}
