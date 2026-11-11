import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageLoader } from "@/components/feedback/page-loader";
import { StatusScreen } from "@/components/feedback/status-screen";
import { Button } from "@/components/ui/button";
import { restoreSession } from "@/features/auth";

type BootState = "loading" | "ready" | "failed";

export function AuthBootstrap({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const [state, setState] = useState<BootState>("loading");

    const boot = useCallback(
        () => restoreSession().then(
            () => setState("ready"),
            () => setState("failed"),
        ),
        [],
    );

    useEffect(() => {
        void boot();
    }, [boot]);

    const retry = () => {
        setState("loading");
        void boot();
    };

    if (state === "loading") return <PageLoader />;

    if (state === "failed") {
        return (
            <StatusScreen
                fullScreen
                title={t("pages.bootError.title")}
                description={t("pages.bootError.description")}
                action={<Button onClick={retry}>{t("actions.retry")}</Button>}
            />
        );
    }

    return children;
}
