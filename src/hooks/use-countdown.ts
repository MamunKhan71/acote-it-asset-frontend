import { useEffect, useState } from "react";

export function useCountdown(seconds = 0, restartKey?: unknown) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        setRemaining(seconds);
        if (seconds <= 0) return;

        const timer = window.setInterval(() => {
            setRemaining((current) => {
                if (current > 1) return current - 1;
                window.clearInterval(timer);
                return 0;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [seconds, restartKey]);

    return remaining;
}
