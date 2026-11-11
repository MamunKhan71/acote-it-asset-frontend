import { CalendarRange, RotateCcw, Search, Tag, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DebouncedInput } from "@/components/form/debounced-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ref } from "@/lib/api/schemas";
import { ACTIVITY_CATEGORIES, type FilterOptions, type HistoryQuery } from "../schemas/history.schema";

type FilterKey = Exclude<keyof HistoryQuery, "page" | "perPage" | "activity">;

type HistoryFiltersProps = {
    query: HistoryQuery;
    onChange: (patch: Partial<Record<FilterKey, string | undefined>>) => void;
    options?: FilterOptions;
};

const ALL = "all";
const FILTER_KEYS: FilterKey[] = ["search", "category", "performedBy", "assetTag", "employee", "siteId", "dateFrom", "dateTo"];

export function HistoryFilters({ query, onChange, options }: HistoryFiltersProps) {
    const { t } = useTranslation("history");
    const hasFilters = FILTER_KEYS.some((key) => query[key] !== undefined);
    const set = (key: FilterKey) => (value: string) => onChange({ [key]: value || undefined });

    return (
        <div className="@container rounded-xl border bg-card p-4">
            <div className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-4">
                <Field label={t("filters.search")} className="@xl:col-span-2">
                    <DebouncedInput icon={Search} value={query.search} onValueChange={set("search")} placeholder={t("filters.searchPlaceholder")} />
                </Field>
                <Field label={t("filters.category")}>
                    <OptionSelect
                        value={query.category}
                        onChange={set("category")}
                        allLabel={t("filters.allCategories")}
                        options={ACTIVITY_CATEGORIES.map((category) => ({ id: category, name: t(`categories.${category}`) }))}
                    />
                </Field>
                <Field label={t("filters.performedBy")}>
                    <OptionSelect value={query.performedBy} onChange={set("performedBy")} allLabel={t("filters.anyone")} options={options?.users ?? []} />
                </Field>
                <Field label={t("filters.assetTag")}>
                    <DebouncedInput icon={Tag} value={query.assetTag} onValueChange={set("assetTag")} placeholder="LT-0042" />
                </Field>
                <Field label={t("filters.employee")}>
                    <DebouncedInput icon={UserRound} value={query.employee} onValueChange={set("employee")} placeholder={t("filters.employeePlaceholder")} />
                </Field>
                <Field label={t("filters.site")}>
                    <OptionSelect value={query.siteId} onChange={set("siteId")} allLabel={t("filters.allSites")} options={options?.sites ?? []} />
                </Field>
                <Field label={t("filters.dateRange")}>
                    <div className="flex items-center gap-2">
                        <CalendarRange className="size-4 shrink-0 text-muted-foreground" />
                        <Input type="date" value={query.dateFrom ?? ""} max={query.dateTo} onChange={(event) => set("dateFrom")(event.target.value)} aria-label={t("filters.dateFrom")} />
                        <Input type="date" value={query.dateTo ?? ""} min={query.dateFrom} onChange={(event) => set("dateTo")(event.target.value)} aria-label={t("filters.dateTo")} />
                    </div>
                </Field>
                {hasFilters && (
                    <div className="flex items-end @xl:col-span-2 @4xl:col-span-4">
                        <Button variant="ghost" size="sm" onClick={() => onChange(Object.fromEntries(FILTER_KEYS.map((key) => [key, undefined])))}>
                            <RotateCcw className="size-4" />
                            {t("filters.reset")}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
    return (
        <div className={className}>
            <Label className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</Label>
            {children}
        </div>
    );
}

function OptionSelect({ value, onChange, allLabel, options }: { value?: string; onChange: (value: string) => void; allLabel: string; options: Ref[] }) {
    return (
        <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? "" : next)}>
            <SelectTrigger className="w-full">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL}>{allLabel}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                        {option.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
