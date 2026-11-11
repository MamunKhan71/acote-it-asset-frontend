import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { usePermission } from "@/features/auth";
import { useUrlQuery } from "@/hooks/use-url-query";
import { useActivitiesQuery, useFilterOptionsQuery } from "../api/history.api";
import { ActivityDetailSheet } from "../components/activity-detail-sheet";
import { useHistoryColumns } from "../components/history-columns";
import { HistoryFilters } from "../components/history-filters";
import { historyQuerySchema } from "../schemas/history.schema";

const HISTORY_VIEW = "history.activity.view";

export default function HistoryPage() {
    const { t } = useTranslation("history");
    const { can } = usePermission();
    const columns = useHistoryColumns();
    const [query, setQuery] = useUrlQuery(historyQuerySchema);
    const { activity, ...listArgs } = query;

    const { data, isLoading, isFetching } = useActivitiesQuery(listArgs);
    const { data: filterOptions } = useFilterOptionsQuery();

    const openActivity = (id?: string) => setQuery({ activity: id, page: query.page });

    return (
        <>
            <p className="-mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>

            <HistoryFilters query={query} onChange={setQuery} options={filterOptions} />

            <div className="space-y-3">
                <DataTable
                    columns={columns}
                    data={data?.items ?? []}
                    getRowId={(row) => row.id}
                    loading={isLoading}
                    fetching={isFetching}
                    skeletonRows={query.perPage > 10 ? 10 : query.perPage}
                    emptyTitle={t("empty.title")}
                    emptyDescription={t("empty.description")}
                    onRowClick={can(HISTORY_VIEW) ? (row) => openActivity(row.id) : undefined}
                    activeRowId={activity}
                />
                <DataTablePagination
                    pagination={data?.pagination}
                    disabled={isFetching}
                    onPageChange={(page) => setQuery({ page })}
                    onPerPageChange={(perPage) => setQuery({ perPage })}
                />
            </div>

            <ActivityDetailSheet activityId={activity} onClose={() => openActivity(undefined)} />
        </>
    );
}
