import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { FormAlert } from "@/components/form/form-alert";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { useZodForm } from "@/hooks/use-zod-form";
import { profileApi } from "../../api/auth.api";
import { useCurrentUser } from "../../hooks/use-current-user";
import { profileSchema, type ProfileValues } from "../../schemas/auth.schema";
import { useAuthStore } from "../../store/auth.store";
import { AvatarUpload } from "./avatar-upload";

const toRequest = ({ name, phone, designation }: ProfileValues) => ({
    name,
    phone: phone || null,
    designation: designation || null,
});

export function ProfileDetails() {
    const { t } = useTranslation("auth");
    const { user, roles } = useCurrentUser();
    const setMe = useAuthStore((state) => state.setMe);
    const form = useZodForm(profileSchema, { name: user.name, phone: user.phone ?? "", designation: user.designation ?? "" });

    const { submit, error, isPending } = useFormSubmit(form, (values) => profileApi.update(toRequest(values)), {
        onSuccess: (me) => {
            setMe(me);
            toast.success(t("messages.profileSaved"));
        },
    });

    return (
        <div className="space-y-6">
            <AvatarUpload />
            <Form {...form}>
                <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
                    <div className="sm:col-span-2">
                        <FormAlert error={error} />
                    </div>
                    <TextField control={form.control} name="name" autoComplete="name" label={t("fields.name")} />
                    <ReadOnlyField label={t("fields.email")} value={user.email} />
                    <TextField control={form.control} name="phone" type="tel" autoComplete="tel" label={t("fields.phone")} />
                    <TextField control={form.control} name="designation" label={t("fields.designation")} />
                    <div className="space-y-2 sm:col-span-2">
                        <Label>{t("fields.roles")}</Label>
                        <div className="flex flex-wrap gap-2">
                            {roles.map((role) => (
                                <Badge key={role.id} variant="secondary">
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <SubmitButton pending={isPending} className="w-auto">
                            {t("actions.save", { ns: "common" })}
                        </SubmitButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <p className="flex h-11 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">{value}</p>
        </div>
    );
}
