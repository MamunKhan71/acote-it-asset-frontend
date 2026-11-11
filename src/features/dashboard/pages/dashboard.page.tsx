import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardCheck, Inbox, PackageCheck, TriangleAlert, UserCheck, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/features/auth";
import { cn } from "@/lib/utils";
import { dashboardApi, dashboardKeys } from "../api/dashboard.api";
import { StatCard } from "../components/stat-card";

const ratio = (part?: number, total?: number) => (part && total ? part / total : 0);

export default function DashboardPage() {
    const { t } = useTranslation();
    const { user } = useCurrentUser();
    const { data, isPending } = useQuery({ queryKey: dashboardKeys.summary, queryFn: dashboardApi.summary });

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">{t("auth:welcome", { name: user.name })}</h2>
                <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 min-[87.5rem]:grid-cols-6">
                <StatCard loading={isPending} tone="emerald" icon={Boxes} label={t("dashboard.stats.assets")} value={data?.totalAssets} hint={data && t("dashboard.hints.types", { count: data.assetTypes })} />
                <StatCard loading={isPending} tone="sky" icon={UserCheck} label={t("dashboard.stats.inUse")} value={data?.inUse} progress={ratio(data?.inUse, data?.totalAssets)} />
                <StatCard loading={isPending} tone="teal" icon={PackageCheck} label={t("dashboard.stats.inStock")} value={data?.inStock} progress={ratio(data?.inStock, data?.totalAssets)} />
                <StatCard loading={isPending} tone="amber" icon={Wrench} label={t("dashboard.stats.faulty")} value={data?.faulty} hint={data && t("dashboard.hints.inRepair", { count: data.inRepair })} />
                <StatCard loading={isPending} tone="rose" icon={TriangleAlert} label={t("dashboard.stats.needsCheck")} value={data?.needsCheck} hint={t("dashboard.hints.needsCheck")} highlight />
                <StatCard loading={isPending} tone="violet" icon={ClipboardCheck} label={t("dashboard.stats.pendingApproval")} value={data?.pendingApprovals} hint={t("dashboard.hints.pendingApproval")} />
            </div>

            <div className="grid gap-4 lg:grid-cols-7">
                <EmptyPanel className="lg:col-span-4" title={t("dashboard.recentActivity")} description={t("dashboard.emptyActivity")} />
                <EmptyPanel className="lg:col-span-3" title={t("dashboard.pendingApprovals")} description={t("dashboard.emptyApprovals")} />
            </div>
        </>
    );
}

function EmptyPanel({ title, description, className }: { title: string; description: string; className?: string }) {
    return (
        <Card className={cn("shadow-sm", className)}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/40 py-12 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Inbox className="size-5" />
                    </span>
                    <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}
