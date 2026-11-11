import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DebouncedInputProps = Omit<ComponentProps<typeof Input>, "value" | "onChange"> & {
    value?: string;
    onValueChange: (value: string) => void;
    delay?: number;
    icon?: LucideIcon;
};

export function DebouncedInput({ value = "", onValueChange, delay = 350, icon: Icon, className, ...props }: DebouncedInputProps) {
    const [draft, setDraft] = useState(value);

    useEffect(() => setDraft(value), [value]);

    useEffect(() => {
        if (draft === value) return;
        const timer = window.setTimeout(() => onValueChange(draft.trim()), delay);
        return () => window.clearTimeout(timer);
    }, [draft, value, delay, onValueChange]);

    return (
        <div className="relative">
            {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
            <Input {...props} value={draft} onChange={(event) => setDraft(event.target.value)} className={cn(Icon && "pl-9", className)} />
        </div>
    );
}
