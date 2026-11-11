import { z } from "zod";
import { optionalText, paginationQuerySchema } from "@/hooks/use-url-query";
import { refSchema } from "@/lib/api/schemas";

export const ACTIVITY_CATEGORIES = ["asset", "handover", "repair", "approval", "people", "admin"] as const;
export const SUBJECT_TYPES = ["asset", "employee", "repair", "approval", "user", "role", "site", "category", "brand"] as const;

export const activityCategorySchema = z.enum(ACTIVITY_CATEGORIES);

export const subjectSchema = z.object({
    type: z.enum(SUBJECT_TYPES),
    id: z.string(),
    label: z.string(),
});

export const actorSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable(),
});

export const activityRowSchema = z.object({
    id: z.string(),
    action: z.string(),
    category: activityCategorySchema,
    description: z.string(),
    performedBy: actorSchema.nullable(),
    subject: subjectSchema.nullable(),
    site: refSchema.nullable(),
    occurredAt: z.iso.datetime({ offset: true }),
});

const changeValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const activityDetailSchema = activityRowSchema.extend({
    changes: z.array(z.object({ field: z.string(), label: z.string(), from: changeValueSchema, to: changeValueSchema })),
    related: z.array(subjectSchema),
    note: z.string().nullable(),
    context: z.object({
        ip: z.string().nullable(),
        userAgent: z.string().nullable(),
        requestId: z.string(),
    }),
});

export const filterOptionsSchema = z.object({
    users: z.array(refSchema),
    sites: z.array(refSchema),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined);

export const historyQuerySchema = paginationQuerySchema.extend({
    search: optionalText,
    category: activityCategorySchema.optional().catch(undefined),
    performedBy: optionalText,
    assetTag: optionalText,
    employee: optionalText,
    siteId: optionalText,
    dateFrom: isoDate,
    dateTo: isoDate,
    activity: optionalText,
});

export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type SubjectType = z.infer<typeof subjectSchema>["type"];
export type Subject = z.infer<typeof subjectSchema>;
export type Actor = z.infer<typeof actorSchema>;
export type ActivityRow = z.infer<typeof activityRowSchema>;
export type ActivityDetail = z.infer<typeof activityDetailSchema>;
export type ChangeValue = z.infer<typeof changeValueSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
export type HistoryQuery = z.infer<typeof historyQuerySchema>;
export type HistoryListArgs = Omit<HistoryQuery, "activity">;
