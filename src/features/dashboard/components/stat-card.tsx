import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
    emerald: { surface: "border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.07] via-emerald-500/[0.025] to-card", chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", bar: "bg-emerald-500/60", text: "text-emerald-700 dark:text-emerald-300" },
    sky: { surface: "border-sky-500/15 bg-gradient-to-br from-sky-500/[0.07] via-sky-500/[0.025] to-card", chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300", bar: "bg-sky-500/60", text: "text-sky-700 dark:text-sky-300" },
    teal: { surface: "border-teal-500/15 bg-gradient-to-br from-teal-500/[0.07] via-teal-500/[0.025] to-card", chip: "bg-teal-500/10 text-teal-700 dark:text-teal-300", bar: "bg-teal-500/60", text: "text-teal-700 dark:text-teal-300" },
    amber: { surface: "border-amber-500/15 bg-gradient-to-br from-amber-500/[0.07] via-amber-500/[0.025] to-card", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300", bar: "bg-amber-500/60", text: "text-amber-700 dark:text-amber-300" },
    rose: { surface: "border-rose-500/15 bg-gradient-to-br from-rose-500/[0.07] via-rose-500/[0.025] to-card", chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300", bar: "bg-rose-500/60", text: "text-rose-700/90 dark:text-rose-300" },
    violet: { surface: "border-violet-500/15 bg-gradient-to-br from-violet-500/[0.07] via-violet-500/[0.025] to-card", chip: "bg-violet-500/10 text-violet-700 dark:text-violet-300", bar: "bg-violet-500/60", text: "text-violet-700 dark:text-violet-300" },
} as const;

export type StatTone = keyof typeof TONES;

type StatCardProps = {
    label: string;
    icon: LucideIcon;
    tone: StatTone;
    value?: number;
    hint?: string;
    progress?: number;
    highlight?: boolean;
    loading?: boolean;
};

export function StatCard({ label, icon: Icon, tone, value, hint, progress, highlight, loading }: StatCardProps) {
    const colors = TONES[tone];

    return (
        <Card className={cn("gap-0 p-4 shadow-none transition-shadow duration-200 hover:shadow-sm", colors.surface)}>
            <div className="flex items-center gap-2.5">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-current/10", colors.chip)}>
                    <Icon className="size-4" />
                </span>
                <p className="truncate text-[13px] font-medium text-muted-foreground">{label}</p>
            </div>
            {loading ? (
                <Skeleton className="mt-3 h-8 w-16" />
            ) : (
                <p className={cn("mt-3 text-[28px] leading-none font-semibold tracking-tight tabular-nums", highlight && colors.text)}>{value ?? "—"}</p>
            )}
            {progress !== undefined ? (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full transition-[width] duration-700", colors.bar)} style={{ width: `${Math.min(progress, 1) * 100}%` }} />
                </div>
            ) : (
                <p className="mt-2 truncate text-xs text-muted-foreground">{hint ?? " "}</p>
            )}
        </Card>
    );
}
