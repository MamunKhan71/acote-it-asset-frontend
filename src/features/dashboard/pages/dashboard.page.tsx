import { Boxes, ClipboardCheck, Inbox, UserCheck, Wrench, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/features/auth";

const STATS: { key: string; icon: LucideIcon }[] = [
    { key: "totalAssets", icon: Boxes },
    { key: "assigned", icon: UserCheck },
    { key: "underRepair", icon: Wrench },
    { key: "pendingApprovals", icon: ClipboardCheck },
];

export default function DashboardPage() {
    const { t } = useTranslation();
    const { user } = useCurrentUser();

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">{t("auth:welcome", { name: user.name })}</h2>
                <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map(({ key, icon: Icon }) => (
                    <Card key={key} className="gap-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardDescription className="font-medium">{t(`dashboard.stats.${key}`)}</CardDescription>
                            <Icon className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold tracking-tight">—</p>
                            <p className="text-xs text-muted-foreground">{t("dashboard.noData")}</p>
                        </CardContent>
                    </Card>
                ))}
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
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Inbox className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
