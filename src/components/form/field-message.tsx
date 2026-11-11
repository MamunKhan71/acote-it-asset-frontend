import { useTranslation } from "react-i18next";
import { useFormField } from "@/components/ui/form";

const VALIDATION_PREFIX = "validation.";

export function FieldMessage() {
    const { t } = useTranslation();
    const { error, formMessageId } = useFormField();
    const message = error?.message;

    if (!message) return null;

    return (
        <p id={formMessageId} className="text-sm text-destructive">
            {message.startsWith(VALIDATION_PREFIX) ? t(message) : message}
        </p>
    );
}
