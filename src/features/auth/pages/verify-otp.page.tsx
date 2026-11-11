import { useMutation } from "@tanstack/react-query";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { paths } from "@/config/paths";
import { useCountdown } from "@/hooks/use-countdown";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import type { ErrorCode } from "@/lib/api/error-codes";
import { toAppError } from "@/lib/api/errors";
import { authApi } from "../api/auth.api";
import { BackToLogin } from "../components/back-to-login";
import { otpSchema } from "../schemas/auth.schema";
import type { ResetLocationState, VerifyOtpLocationState } from "../types";

const CODE_UNUSABLE: ErrorCode[] = ["OTP_EXPIRED", "OTP_TOO_MANY_ATTEMPTS"];

export default function VerifyOtpPage() {
    const state = useLocation().state as VerifyOtpLocationState;
    return state?.email ? <VerifyOtpForm email={state.email} resendAfter={state.resendAfter} /> : <Navigate to={paths.forgotPassword} replace />;
}

function VerifyOtpForm({ email, resendAfter }: NonNullable<VerifyOtpLocationState>) {
    const { t } = useTranslation("auth");
    const navigate = useNavigate();
    const form = useZodForm(otpSchema, { otp: "" });
    const [cooldown, setCooldown] = useState({ seconds: resendAfter, startedAt: Date.now() });
    const resendWait = useCountdown(cooldown.seconds, cooldown.startedAt);

    const { submit, error, isPending, clearError } = useFormSubmit(form, ({ otp }) => authApi.verifyOtp({ email, otp }), {
        onSuccess: ({ resetToken }) =>
            navigate(paths.resetPassword, { replace: true, state: { resetToken, email } satisfies ResetLocationState }),
        onError: () => form.resetField("otp"),
    });

    const resend = useMutation({
        mutationFn: () => authApi.forgotPassword({ email }),
        onSuccess: ({ resendAfter: seconds }) => {
            clearError();
            form.reset();
            setCooldown({ seconds, startedAt: Date.now() });
        },
        onError: (resendError) => setCooldown({ seconds: toAppError(resendError).meta.retryAfter ?? 0, startedAt: Date.now() }),
    });

    const locked = !!error && CODE_UNUSABLE.includes(error.code);

    return (
        <Form {...form}>
            <form onSubmit={submit} className="space-y-5" noValidate>
                <p className="text-center text-sm text-muted-foreground">{t("verify.sentTo", { email })}</p>
                <FormAlert error={error} />
                <TextField
                    control={form.control}
                    name="otp"
                    icon={KeyRound}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    disabled={locked}
                    label={t("fields.otp")}
                    placeholder={t("placeholders.otp")}
                    className="tracking-[0.5em]"
                />
                <SubmitButton pending={isPending} disabled={locked}>
                    {t("actions.verify")}
                </SubmitButton>
                <Button type="button" variant="ghost" className="w-full" disabled={resendWait > 0 || resend.isPending} onClick={() => resend.mutate()}>
                    {resendWait > 0 ? t("actions.resendIn", { seconds: resendWait }) : t("actions.resend")}
                </Button>
                <BackToLogin />
            </form>
        </Form>
    );
}
