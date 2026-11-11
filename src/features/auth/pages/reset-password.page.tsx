import { LockKeyhole } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Form } from "@/components/ui/form";
import { paths } from "@/config/paths";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import { authApi } from "../api/auth.api";
import { BackToLogin } from "../components/back-to-login";
import { resetSchema } from "../schemas/auth.schema";
import type { LoginLocationState, ResetLocationState } from "../types";

export default function ResetPasswordPage() {
    const state = useLocation().state as ResetLocationState;
    return state?.resetToken ? <ResetPasswordForm {...state} /> : <Navigate to={paths.forgotPassword} replace />;
}

function ResetPasswordForm({ resetToken, email }: NonNullable<ResetLocationState>) {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const form = useZodForm(resetSchema, { newPassword: "", confirmPassword: "" });

    const { submit, error, isPending } = useFormSubmit(form, (values) => authApi.resetPassword({ resetToken, ...values }), {
        onSuccess: () =>
            navigate(paths.login, { replace: true, state: { notice: "passwordReset", email } satisfies LoginLocationState }),
    });

    return (
        <Form {...form}>
            <form onSubmit={submit} className="space-y-5" noValidate>
                <FormAlert error={error} />
                {error && (
                    <Link to={paths.forgotPassword} className="block text-center text-sm font-medium text-primary hover:underline">
                        {t("actions.startAgain")}
                    </Link>
                )}
                <TextField
                    control={form.control}
                    name="newPassword"
                    type="password"
                    icon={LockKeyhole}
                    autoComplete="new-password"
                    label={t("fields.newPassword")}
                />
                <TextField
                    control={form.control}
                    name="confirmPassword"
                    type="password"
                    icon={LockKeyhole}
                    autoComplete="new-password"
                    label={t("fields.confirmPassword")}
                />
                <SubmitButton pending={isPending}>{t("actions.resetPassword")}</SubmitButton>
                <BackToLogin />
            </form>
        </Form>
    );
}
