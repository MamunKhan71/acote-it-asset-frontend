import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/format";
import type { ActivityRow } from "../schemas/history.schema";
import { ActorCell } from "./actor-cell";
import { CategoryBadge } from "./category-badge";

const column = createColumnHelper<ActivityRow>();

export function useHistoryColumns() {
    const { t } = useTranslation("history");

    return useMemo(
        () => [
            column.display({
                id: "activity",
                header: t("columns.activity"),
                meta: { className: "min-w-72 whitespace-normal" },
                cell: ({ row }) => (
                    <div className="space-y-0.5">
                        <p className="font-medium leading-snug">{row.original.description}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{row.original.action}</p>
                    </div>
                ),
            }),
            column.display({
                id: "category",
                header: t("columns.category"),
                cell: ({ row }) => <CategoryBadge category={row.original.category} />,
            }),
            column.display({
                id: "performedBy",
                header: t("columns.performedBy"),
                meta: { className: "min-w-44" },
                cell: ({ row }) => <ActorCell actor={row.original.performedBy} />,
            }),
            column.display({
                id: "related",
                header: t("columns.related"),
                meta: { className: "min-w-52" },
                cell: ({ row }) => {
                    const { subject, site } = row.original;
                    if (!subject) return <span className="text-muted-foreground">—</span>;
                    return (
                        <div className="space-y-0.5">
                            <p className="truncate text-sm">{subject.label}</p>
                            <p className="text-xs text-muted-foreground">
                                {t(`subjects.${subject.type}`)}
                                {site && ` · ${site.name}`}
                            </p>
                        </div>
                    );
                },
            }),
            column.display({
                id: "occurredAt",
                header: t("columns.occurredAt"),
                meta: { className: "whitespace-nowrap text-sm text-muted-foreground", headerClassName: "text-right" },
                cell: ({ row }) => <span className="block text-right tabular-nums">{formatDateTime(row.original.occurredAt)}</span>,
            }),
        ],
        [t],
    );
}
