import { LockKeyhole, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { paths } from "@/config/paths";
import { useCountdown } from "@/hooks/use-countdown";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import { authApi } from "../api/auth.api";
import { safeRedirect } from "../lib/redirect";
import { startSession } from "../lib/session";
import { loginSchema } from "../schemas/auth.schema";
import type { LoginLocationState } from "../types";

export default function LoginPage() {
    const { t, i18n } = useTranslation("auth");
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const state = useLocation().state as LoginLocationState;

    const form = useZodForm(loginSchema, { email: state?.email ?? "", password: "", rememberMe: false });

    const { submit, error, isPending } = useFormSubmit(form, authApi.login, {
        onSuccess: (data) => {
            startSession(data);
            navigate(safeRedirect(params.get("redirect")), { replace: true });
        },
        onError: () => form.resetField("password"),
    });

    const wait = useCountdown(error?.meta.retryAfter, error);
    const noticeKey = `notices.${state?.notice ?? params.get("reason")}`;
    const notice = i18n.exists(noticeKey, { ns: "auth" }) ? t(noticeKey) : null;

    return (
        <Form {...form}>
            <form onSubmit={submit} className="space-y-5" noValidate>
                {error ? <FormAlert error={error} /> : <FormAlert message={notice} />}

                <TextField
                    control={form.control}
                    name="email"
                    type="email"
                    icon={Mail}
                    autoComplete="username"
                    label={t("fields.email")}
                    placeholder={t("placeholders.email")}
                />

                <TextField
                    control={form.control}
                    name="password"
                    type="password"
                    icon={LockKeyhole}
                    autoComplete="current-password"
                    label={t("fields.password")}
                    placeholder={t("placeholders.password")}
                    labelAside={
                        <Link to={paths.forgotPassword} className="text-sm font-medium text-primary hover:underline">
                            {t("actions.forgotPassword")}
                        </Link>
                    }
                />

                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                            </FormControl>
                            <FormLabel className="font-normal">{t("fields.rememberMe")}</FormLabel>
                        </FormItem>
                    )}
                />

                <SubmitButton pending={isPending} disabled={wait > 0}>
                    {wait > 0 ? t("actions.retryIn", { seconds: wait }) : t("actions.signIn")}
                </SubmitButton>
            </form>
        </Form>
    );
}
