import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { StatusScreen } from "@/components/feedback/status-screen";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";

export function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <StatusScreen
            fullScreen
            code="404"
            title={t("pages.notFound.title")}
            description={t("pages.notFound.description")}
            action={
                <Button asChild>
                    <Link to={paths.dashboard}>{t("actions.goHome")}</Link>
                </Button>
            }
        />
    );
}
