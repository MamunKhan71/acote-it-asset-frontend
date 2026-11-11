import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "../hooks/use-current-user";
import { useUpdatePreferences } from "../hooks/use-update-preferences";

export function ThemeToggle() {
    const { t } = useTranslation();
    const { preferences } = useCurrentUser();
    const update = useUpdatePreferences();
    const isDark = preferences.theme === "dark" || (preferences.theme === "system" && document.documentElement.classList.contains("dark"));

    return (
        <Button variant="ghost" size="icon" aria-label={t("actions.toggleTheme")} onClick={() => update.mutate({ theme: isDark ? "light" : "dark" })}>
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}
