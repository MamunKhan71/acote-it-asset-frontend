import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

export function BackToLogin() {
    const { t } = useTranslation("auth");

    return (
        <Link to={paths.login} className="block text-center text-sm font-medium text-primary hover:underline">
            {t("actions.backToLogin")}
        </Link>
    );
}
