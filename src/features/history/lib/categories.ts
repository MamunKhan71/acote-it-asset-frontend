import { ArrowLeftRight, Boxes, ClipboardCheck, ShieldCheck, Users, Wrench, type LucideIcon } from "lucide-react";
import type { ActivityCategory } from "../schemas/history.schema";

export const CATEGORY_STYLES: Record<ActivityCategory, { icon: LucideIcon; className: string }> = {
    asset: { icon: Boxes, className: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/15 dark:text-emerald-300" },
    handover: { icon: ArrowLeftRight, className: "bg-sky-500/10 text-sky-700 ring-sky-600/15 dark:text-sky-300" },
    repair: { icon: Wrench, className: "bg-amber-500/10 text-amber-700 ring-amber-600/15 dark:text-amber-300" },
    approval: { icon: ClipboardCheck, className: "bg-violet-500/10 text-violet-700 ring-violet-600/15 dark:text-violet-300" },
    people: { icon: Users, className: "bg-teal-500/10 text-teal-700 ring-teal-600/15 dark:text-teal-300" },
    admin: { icon: ShieldCheck, className: "bg-slate-500/10 text-slate-700 ring-slate-600/15 dark:text-slate-300" },
};
