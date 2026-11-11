import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { AppMark } from "@/components/brand/app-mark";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-route-handle";

export function AuthLayout() {
    const { t } = useTranslation();
    const { title, subtitle } = usePageTitle();

    return (
        <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden p-4">
            <div aria-hidden className="absolute inset-0 -z-20 scale-105 bg-[url('/acote-it-asset-bg.webp')] bg-cover bg-center blur-[4px] brightness-110" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900/40 via-emerald-800/20 to-slate-900/40" />
            <Card className="w-full max-w-md border-white/20 bg-card/95 shadow-2xl backdrop-blur-sm">
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
