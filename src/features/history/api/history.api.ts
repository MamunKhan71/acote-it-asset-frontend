import type { z } from "zod";
import { baseApi } from "@/lib/api/base-api";
import { toQuery } from "@/lib/api/client";
import { listSchema, successSchema, type Pagination } from "@/lib/api/schemas";
import {
    activityDetailSchema,
    activityRowSchema,
    filterOptionsSchema,
    type ActivityDetail,
    type ActivityRow,
    type FilterOptions,
    type HistoryListArgs,
} from "../schemas/history.schema";

const activityListResponse = listSchema(activityRowSchema);
const activityResponse = successSchema(activityDetailSchema);
const filterOptionsResponse = successSchema(filterOptionsSchema);

const definedOnly = (values: Record<string, string | undefined>) =>
    Object.fromEntries(Object.entries(values).filter((entry): entry is [string, string] => entry[1] !== undefined));

export const historyApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        activities: build.query<{ items: ActivityRow[]; pagination?: Pagination }, HistoryListArgs>({
            query: ({ page, perPage, search, ...filter }) => ({
                url: "/history/activities",
                params: toQuery({ page, perPage, search, filter: definedOnly(filter) }),
                schema: activityListResponse,
            }),
            transformResponse: (response: z.infer<typeof activityListResponse>) => ({
                items: response.data,
                pagination: response.meta?.pagination,
            }),
            providesTags: ["Activity"],
        }),
        activity: build.query<ActivityDetail, string>({
            query: (id) => ({ url: `/history/activities/${id}`, schema: activityResponse }),
            transformResponse: (response: z.infer<typeof activityResponse>) => response.data,
            providesTags: (_result, _error, id) => [{ type: "Activity", id }],
        }),
        filterOptions: build.query<FilterOptions, void>({
            query: () => ({ url: "/history/filter-options", schema: filterOptionsResponse }),
            transformResponse: (response: z.infer<typeof filterOptionsResponse>) => response.data,
            keepUnusedDataFor: 300,
        }),
    }),
});

export const { useActivitiesQuery, useActivityQuery, useFilterOptionsQuery } = historyApi;
