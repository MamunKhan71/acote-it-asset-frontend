import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/lib/i18n";
import { THEMES } from "@/lib/theme";
import { useCurrentUser } from "../../hooks/use-current-user";
import { useUpdatePreferences } from "../../hooks/use-update-preferences";
import type { Preferences } from "../../types";

const DATE_FORMATS = ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
const TIME_FORMATS = ["12h", "24h"] as const;

type Option = { value: string; label: string };

export function PreferencesForm() {
    const { t } = useTranslation("auth");
    const { preferences } = useCurrentUser();
    const save = useUpdatePreferences();

    const change = <K extends keyof Preferences>(key: K) => (value: Preferences[K]) => save.mutate({ [key]: value });

    return (
        <div className="grid gap-5 sm:grid-cols-2">
            <PreferenceSelect
                label={t("fields.theme")}
                value={preferences.theme}
                onChange={change("theme")}
                options={THEMES.map((theme) => ({ value: theme, label: t(`theme.${theme}`, { ns: "common" }) }))}
            />
            <PreferenceSelect
                label={t("fields.language")}
                value={preferences.language}
                onChange={change("language")}
                options={LANGUAGES.map((language) => ({ value: language, label: t(`language.${language}`, { ns: "common" }) }))}
            />
            <PreferenceSelect
                label={t("fields.dateFormat")}
                value={preferences.dateFormat}
                onChange={change("dateFormat")}
                options={DATE_FORMATS.map((format) => ({ value: format, label: format }))}
            />
            <PreferenceSelect
                label={t("fields.timeFormat")}
                value={preferences.timeFormat}
                onChange={change("timeFormat")}
                options={TIME_FORMATS.map((format) => ({ value: format, label: t(`options.timeFormat.${format}`) }))}
            />
            <PreferenceRow label={t("fields.emailNotification")}>
                <Switch checked={preferences.emailNotification} onCheckedChange={change("emailNotification")} />
            </PreferenceRow>
        </div>
    );
}

function PreferenceRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div>{children}</div>
        </div>
    );
}

function PreferenceSelect<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Option[]; onChange: (value: T) => void }) {
    return (
        <PreferenceRow label={label}>
            <Select value={value} onValueChange={(next) => onChange(next as T)}>
                <SelectTrigger className="h-11 w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </PreferenceRow>
    );
}
