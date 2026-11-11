import { useTranslation } from "react-i18next";
import { StatusScreen } from "@/components/feedback/status-screen";

export function ForbiddenPage() {
    const { t } = useTranslation();
    return <StatusScreen code="403" title={t("pages.forbidden.title")} description={t("pages.forbidden.description")} />;
}
