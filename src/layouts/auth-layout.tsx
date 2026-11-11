import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AppMark } from "@/components/brand/app-mark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-route-handle";

export function AuthLayout() {
    const { t } = useTranslation();
    const { title, subtitle } = usePageTitle();

    return (
        <main className="app-backdrop flex min-h-svh items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
                <CardHeader className="items-center gap-2 text-center">
                    <AppMark className="mx-auto size-12 rounded-xl" />
                    <p className="text-sm font-semibold text-muted-foreground">{t("app.name")}</p>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    {subtitle && <CardDescription>{subtitle}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <Outlet />
                </CardContent>
            </Card>
        </main>
    );
}
