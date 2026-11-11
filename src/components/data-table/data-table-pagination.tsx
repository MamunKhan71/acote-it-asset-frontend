import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PAGE_SIZES } from "@/hooks/use-url-query";
import type { Pagination } from "@/lib/api/schemas";
import { cn } from "@/lib/utils";

type DataTablePaginationProps = {
    pagination?: Pagination;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    disabled?: boolean;
};

type PageItem = number | "gap";

const SIBLINGS = 1;

function pageItems(current: number, last: number): PageItem[] {
    const pages = new Set([1, last, ...Array.from({ length: SIBLINGS * 2 + 1 }, (_, index) => current - SIBLINGS + index)]);
    const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
    return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? ["gap" as const, page] : [page]));
}

export function DataTablePagination({ pagination, onPageChange, onPerPageChange, disabled }: DataTablePaginationProps) {
    const { t } = useTranslation();
    const [target, setTarget] = useState("");

    if (!pagination) return null;

    const { currentPage, lastPage, perPage, total } = pagination;
    const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    const goTo = (event: FormEvent) => {
        event.preventDefault();
        const page = Number(target);
        if (Number.isInteger(page) && page >= 1 && page <= lastPage && page !== currentPage) onPageChange(page);
        setTarget("");
    };

    return (
        <div className="flex flex-col gap-3 px-1 text-sm lg:flex-row lg:items-center lg:justify-between">
            <p className="text-muted-foreground">{t("table.showing", { from, to, total })}</p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t("table.rowsPerPage")}</span>
                    <Select value={String(perPage)} onValueChange={(value) => onPerPageChange(Number(value))} disabled={disabled}>
                        <SelectTrigger size="sm" className="w-[72px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZES.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <nav className="flex items-center gap-1" aria-label={t("table.pagination")}>
                    <Button variant="outline" size="icon" className="size-8" disabled={disabled || currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} aria-label={t("table.previous")}>
                        <ChevronLeft className="size-4" />
                    </Button>
                    {pageItems(currentPage, lastPage).map((item, index) =>
                        item === "gap" ? (
                            <span key={`gap-${index}`} className="px-1 text-muted-foreground">
                                …
                            </span>
                        ) : (
                            <Button
                                key={item}
                                variant={item === currentPage ? "default" : "ghost"}
                                size="icon"
                                className={cn("size-8 tabular-nums", item === currentPage && "pointer-events-none")}
                                disabled={disabled}
                                onClick={() => onPageChange(item)}
                                aria-current={item === currentPage ? "page" : undefined}
                            >
                                {item}
                            </Button>
                        ),
                    )}
                    <Button variant="outline" size="icon" className="size-8" disabled={disabled || currentPage >= lastPage} onClick={() => onPageChange(currentPage + 1)} aria-label={t("table.next")}>
                        <ChevronRight className="size-4" />
                    </Button>
                </nav>

                <form onSubmit={goTo} className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t("table.goTo")}</span>
                    <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={lastPage}
                        value={target}
                        onChange={(event) => setTarget(event.target.value)}
                        placeholder={String(currentPage)}
                        disabled={disabled || lastPage <= 1}
                        className="h-8 w-16 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label={t("table.goTo")}
                    />
                    <span className="text-muted-foreground">{t("table.of", { last: lastPage })}</span>
                </form>
            </div>
        </div>
    );
}
