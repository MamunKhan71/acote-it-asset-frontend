import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Form } from "@/components/ui/form";
import { paths } from "@/config/paths";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import { authApi } from "../api/auth.api";
import { BackToLogin } from "../components/back-to-login";
import { forgotSchema } from "../schemas/auth.schema";
import type { VerifyOtpLocationState } from "../types";

export default function ForgotPasswordPage() {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const form = useZodForm(forgotSchema, { email: "" });

    const goToVerify = (email: string, resendAfter: number) =>
        navigate(paths.verifyOtp, { state: { email, resendAfter } satisfies VerifyOtpLocationState });

    const { submit, error, isPending } = useFormSubmit(form, authApi.forgotPassword, {
        onSuccess: ({ resendAfter }, { email }) => {
            toast.success(t("forgot.sent"));
            goToVerify(email, resendAfter);
        },
        onError: ({ code, meta }, { email }) => {
            if (code === "OTP_RESEND_COOLDOWN") goToVerify(email, meta.retryAfter ?? 0);
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={submit} className="space-y-5" noValidate>
                <FormAlert error={error} />
                <TextField
                    control={form.control}
                    name="email"
                    type="email"
                    icon={Mail}
                    autoComplete="email"
                    label={t("fields.email")}
                    placeholder={t("placeholders.email")}
                />
                <SubmitButton pending={isPending}>{t("actions.sendCode")}</SubmitButton>
                <BackToLogin />
            </form>
        </Form>
    );
}
