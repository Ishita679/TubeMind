import { useState, useCallback } from "react";

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const toast = useCallback((message, type = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => dismiss(id), 5000);
    }, []);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return { toasts, toast, dismiss };
}
