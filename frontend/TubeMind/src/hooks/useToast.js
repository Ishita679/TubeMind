import { useState, useCallback, useRef } from "react";

let toastCounter = 0;

/**
 * Lightweight toast notification system.
 * No external dependency – just local state + setTimeout.
 */
export function useToast() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        clearTimeout(timers.current[id]);
        delete timers.current[id];
    }, []);

    const toast = useCallback(
        (message, type = "success", duration = 3500) => {
            const id = ++toastCounter;
            setToasts((prev) => [...prev, { id, message, type }]);
            timers.current[id] = setTimeout(() => dismiss(id), duration);
            return id;
        },
        [dismiss]
    );

    return { toasts, toast, dismiss };
}
