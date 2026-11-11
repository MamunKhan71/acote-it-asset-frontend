import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { describeError, type AppError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

type Tone = "error" | "info" | "success";

type FormAlertProps = {
    error?: Pick<AppError, "code" | "message" | "meta" | "requestId"> | null;
    message?: string | null;
    tone?: Tone;
};

const TONES: Record<Tone, { icon: LucideIcon; className: string }> = {
    error: { icon: CircleAlert, className: "border-destructive/20 bg-destructive/10 text-destructive" },
    info: { icon: Info, className: "border-primary/20 bg-primary/5 text-foreground" },
    success: { icon: CircleCheck, className: "border-primary/20 bg-primary/10 text-primary" },
};

export function FormAlert({ error, message, tone = error ? "error" : "info" }: FormAlertProps) {
    const text = error ? describeError(error) : message;
    if (!text) return null;

    const { icon: Icon, className } = TONES[tone];

    return (
        <Alert role="alert" className={cn("flex items-start gap-2", className)}>
            <Icon className="mt-0.5 size-4 shrink-0" />
            <AlertDescription className="text-current">{text}</AlertDescription>
        </Alert>
    );
}
