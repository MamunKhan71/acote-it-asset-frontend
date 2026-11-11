import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMatches } from "react-router-dom";
import type { RouteHandle } from "@/config/route-handle";

export function useRouteHandle(): RouteHandle {
    const matches = useMatches();
    return Object.assign({}, ...matches.map((match) => match.handle ?? {}));
}

export function useRoutePermissions() {
    return useMatches()
        .map((match) => (match.handle as RouteHandle | undefined)?.permission)
        .filter((permission): permission is string => Boolean(permission));
}

export function usePageTitle() {
    const { t } = useTranslation();
    const { titleKey, subtitleKey } = useRouteHandle();
    const title = titleKey ? t(titleKey) : "";
    const subtitle = subtitleKey ? t(subtitleKey) : "";
    const appName = t("app.name");

    useEffect(() => {
        document.title = title ? `${title} · ${appName}` : appName;
    }, [title, appName]);

    return { title, subtitle };
}
