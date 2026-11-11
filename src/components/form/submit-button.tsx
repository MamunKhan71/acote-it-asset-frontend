import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = ComponentProps<typeof Button> & {
    pending?: boolean;
};

export function SubmitButton({ pending, disabled, children, className, ...props }: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={pending || disabled} className={cn("h-11 w-full", className)} {...props}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {children}
        </Button>
    );
}
