import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./field-message";

type TextFieldProps<T extends FieldValues> = Omit<ComponentProps<typeof Input>, "name" | "defaultValue"> & {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    icon?: LucideIcon;
    labelAside?: ReactNode;
};

export function TextField<T extends FieldValues>({ control, name, label, icon: Icon, labelAside, type, className, ...inputProps }: TextFieldProps<T>) {
    const { t } = useTranslation();
    const [revealed, setRevealed] = useState(false);
    const isPassword = type === "password";

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>{label}</FormLabel>
                        {labelAside}
                    </div>
                    <div className="relative">
                        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
                        <FormControl>
                            <Input
                                {...inputProps}
                                {...field}
                                value={field.value ?? ""}
                                type={isPassword && revealed ? "text" : type}
                                className={cn("h-11", Icon && "pl-9", isPassword && "pr-10", className)}
                            />
                        </FormControl>
                        {isPassword && (
                            <button
                                type="button"
                                onClick={() => setRevealed((value) => !value)}
                                aria-label={t("actions.togglePassword")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        )}
                    </div>
                    <FieldMessage />
                </FormItem>
            )}
        />
    );
}
