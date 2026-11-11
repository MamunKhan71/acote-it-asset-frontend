import { cn } from "@/lib/utils";

export function AppMark({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex aspect-square size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-700/25 ring-1 ring-inset ring-white/15",
                className,
            )}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" className="size-[58%]" aria-hidden>
                <path d="M12 2.75 20 7.25v9.5l-8 4.5-8-4.5v-9.5z" />
                <path d="M4 7.25 12 11.75l8-4.5M12 11.75v9.5" />
                <path d="m8 5 8 4.5" opacity={0.55} />
            </svg>
        </div>
    );
}
