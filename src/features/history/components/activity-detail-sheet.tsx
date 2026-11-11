import { skipToken } from "@reduxjs/toolkit/query";
import { ArrowRight, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { FormAlert } from "@/components/form/form-alert";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { asApiError } from "@/lib/api/base-api";
import { formatDateTime } from "@/lib/format";
import { useActivityQuery } from "../api/history.api";
import type { ActivityDetail, ChangeValue, Subject } from "../schemas/history.schema";
import { ActorCell } from "./actor-cell";
import { CategoryBadge } from "./category-badge";

type ActivityDetailSheetProps = {
    activityId?: string;
    onClose: () => void;
};

export function ActivityDetailSheet({ activityId, onClose }: ActivityDetailSheetProps) {
    const { t } = useTranslation("history");
    const { data, isFetching, error } = useActivityQuery(activityId ?? skipToken);

    return (
        <Sheet open={Boolean(activityId)} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-xl">
                <SheetHeader className="border-b">
                    <SheetTitle>{t("detail.title")}</SheetTitle>
                    <SheetDescription className="flex items-center gap-1.5">
                        <Lock className="size-3.5" />
                        {t("detail.readOnly")}
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4">
                    {error && <FormAlert error={asApiError(error)} />}
                    {isFetching && !data && <DetailSkeleton />}
                    {data && data.id === activityId && <DetailBody activity={data} />}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function DetailBody({ activity }: { activity: ActivityDetail }) {
    const { t } = useTranslation("history");

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <CategoryBadge category={activity.category} />
                <p className="text-lg font-semibold leading-snug">{activity.description}</p>
                <p className="font-mono text-xs text-muted-foreground">{activity.action}</p>
            </div>

            <dl className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2">
                <Info label={t("detail.performedBy")}>
                    <ActorCell actor={activity.performedBy} />
                </Info>
                <Info label={t("detail.occurredAt")}>{formatDateTime(activity.occurredAt, "medium")}</Info>
                <Info label={t("detail.relatedItem")}>{activity.subject ? <SubjectLine subject={activity.subject} /> : "—"}</Info>
                <Info label={t("detail.site")}>{activity.site?.name ?? "—"}</Info>
            </dl>

            {activity.changes.length > 0 && (
                <Section title={t("detail.changes")}>
                    <div className="overflow-hidden rounded-xl border">
                        <div className="grid grid-cols-[1fr_1fr_auto_1fr] gap-x-3 bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <span>{t("detail.field")}</span>
                            <span>{t("detail.previous")}</span>
                            <span />
                            <span>{t("detail.updated")}</span>
                        </div>
                        {activity.changes.map((change) => (
                            <div key={change.field} className="grid grid-cols-[1fr_1fr_auto_1fr] items-center gap-x-3 border-t px-4 py-2.5 text-sm">
                                <span className="font-medium">{change.label}</span>
                                <ChangeValueText value={change.from} className="text-muted-foreground line-through decoration-muted-foreground/40" />
                                <ArrowRight className="size-3.5 text-muted-foreground" />
                                <ChangeValueText value={change.to} className="font-medium text-primary" />
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {activity.related.length > 0 && (
                <Section title={t("detail.related")}>
                    <ul className="space-y-2">
                        {activity.related.map((item) => (
                            <li key={`${item.type}-${item.id}`} className="rounded-lg border px-3 py-2">
                                <SubjectLine subject={item} />
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {activity.note && (
                <Section title={t("detail.note")}>
                    <p className="rounded-lg border-l-4 border-primary/40 bg-muted/40 px-3 py-2 text-sm">{activity.note}</p>
                </Section>
            )}

            <Section title={t("detail.context")}>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <Info label={t("detail.ip")}>{activity.context.ip ?? "—"}</Info>
                    <Info label={t("detail.device")}>{activity.context.userAgent ?? "—"}</Info>
                    <Info label={t("detail.requestId")} className="sm:col-span-2">
                        <span className="break-all font-mono text-xs">{activity.context.requestId}</span>
                    </Info>
                </dl>
            </Section>
        </div>
    );
}

function SubjectLine({ subject }: { subject: Subject }) {
    const { t } = useTranslation("history");

    return (
        <span className="block">
            <span className="block text-sm">{subject.label}</span>
            <span className="block text-xs text-muted-foreground">{t(`subjects.${subject.type}`)}</span>
        </span>
    );
}

function ChangeValueText({ value, className }: { value: ChangeValue; className?: string }) {
    const { t } = useTranslation("history");
    const text = value === null ? "—" : typeof value === "boolean" ? t(value ? "detail.yes" : "detail.no") : String(value);
    return <span className={className}>{text}</span>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
            {children}
        </section>
    );
}

function Info({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
    return (
        <div className={className}>
            <dt className="mb-1 text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
        </div>
    );
}
