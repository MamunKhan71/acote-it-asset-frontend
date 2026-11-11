import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "../lib/categories";
import type { ActivityCategory } from "../schemas/history.schema";

export function CategoryBadge({ category }: { category: ActivityCategory }) {
    const { t } = useTranslation("history");
    const { icon: Icon, className } = CATEGORY_STYLES[category];

    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", className)}>
            <Icon className="size-3.5" />
            {t(`categories.${category}`)}
        </span>
    );
}
