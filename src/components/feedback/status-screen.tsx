import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatusScreenProps = {
    code?: string;
    title: string;
    description: string;
    action?: ReactNode;
    fullScreen?: boolean;
};

export function StatusScreen({ code, title, description, action, fullScreen }: StatusScreenProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-3 px-4 py-16 text-center", fullScreen && "min-h-svh")}>
            {code && <p className="text-5xl font-bold text-primary">{code}</p>}
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="max-w-md text-sm text-muted-foreground">{description}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
