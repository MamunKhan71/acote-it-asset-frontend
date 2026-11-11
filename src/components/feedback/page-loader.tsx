import { Loader2 } from "lucide-react";

export function PageLoader() {
    return (
        <div className="flex min-h-svh items-center justify-center" role="status" aria-live="polite">
            <Loader2 className="size-8 animate-spin text-primary" />
        </div>
    );
}
