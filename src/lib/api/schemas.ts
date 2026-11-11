import { z } from "zod";

export const paginationSchema = z.object({
    currentPage: z.number().int().min(1),
    lastPage: z.number().int().min(1),
    perPage: z.number().int().min(1),
    total: z.number().int().min(0),
});

export const successSchema = <T extends z.ZodType>(data: T) =>
    z.object({
        success: z.literal(true),
        message: z.string(),
        data,
        requestId: z.string(),
    });

export const listSchema = <T extends z.ZodType>(item: T) =>
    z.object({
        success: z.literal(true),
        message: z.string(),
        data: z.array(item),
        meta: z.object({ pagination: paginationSchema }).optional(),
        requestId: z.string(),
    });

export const refSchema = z.object({ id: z.string(), name: z.string() });

export type Pagination = z.infer<typeof paginationSchema>;
export type Ref = z.infer<typeof refSchema>;
