import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Form } from "@/components/ui/form";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import { profileApi } from "../../api/auth.api";
import { updateToken } from "../../lib/session";
import { changePasswordSchema } from "../../schemas/auth.schema";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordForm() {
    const { t } = useTranslation("auth");
    const form = useZodForm(changePasswordSchema, EMPTY);

    const { submit, error, isPending } = useFormSubmit(form, profileApi.changePassword, {
        onSuccess: (token) => {
            updateToken(token);
            form.reset(EMPTY);
            toast.success(t("messages.passwordChanged"));
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={submit} className="max-w-md space-y-5" noValidate>
                <FormAlert error={error} />
                <TextField control={form.control} name="currentPassword" type="password" autoComplete="current-password" label={t("fields.currentPassword")} />
                <TextField control={form.control} name="newPassword" type="password" autoComplete="new-password" label={t("fields.newPassword")} />
                <TextField control={form.control} name="confirmPassword" type="password" autoComplete="new-password" label={t("fields.confirmPassword")} />
                <SubmitButton pending={isPending} className="w-auto">
                    {t("actions.changePassword")}
                </SubmitButton>
            </form>
        </Form>
    );
}
