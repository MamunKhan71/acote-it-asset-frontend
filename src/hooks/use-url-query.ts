import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

export const PAGE_SIZES = [10, 20, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 20;

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).catch(1),
    perPage: z.coerce
        .number()
        .int()
        .refine((size) => PAGE_SIZES.includes(size as (typeof PAGE_SIZES)[number]))
        .catch(DEFAULT_PAGE_SIZE),
});

export const optionalText = z.string().trim().min(1).optional().catch(undefined);

type QueryValue = string | number | null | undefined;

export function useUrlQuery<TSchema extends z.ZodObject>(schema: TSchema) {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = useMemo(() => schema.parse(Object.fromEntries(searchParams)) as z.output<TSchema>, [schema, searchParams]);

    const setQuery = useCallback(
        (patch: Partial<Record<keyof z.output<TSchema>, QueryValue>>) => {
            const keepsPage = "page" in patch;
            setSearchParams(
                (current) => {
                    const next = new URLSearchParams(current);
                    Object.entries(patch).forEach(([key, value]) => {
                        if (value === undefined || value === null || value === "") next.delete(key);
                        else next.set(key, String(value));
                    });
                    if (!keepsPage) next.delete("page");
                    return next;
                },
                { replace: !keepsPage },
            );
        },
        [setSearchParams],
    );

    return [query, setQuery] as const;
}
