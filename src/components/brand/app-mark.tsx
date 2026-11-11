import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppMark({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-600 text-emerald-950 shadow-lg shadow-emerald-500/30 ring-1 ring-white/20",
                className,
            )}
        >
            <Boxes className="size-1/2" strokeWidth={2.25} />
        </div>
    );
}
