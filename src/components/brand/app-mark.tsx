import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppMark({ className }: { className?: string }) {
    return (
        <div className={cn("flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", className)}>
            <Boxes className="size-1/2" />
        </div>
    );
}
