import { Construction } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoonPage() {
    const { t } = useTranslation();

    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <Construction className="size-10 text-muted-foreground" />
                <h2 className="text-lg font-semibold">{t("pages.comingSoon.title")}</h2>
                <p className="max-w-sm text-sm text-muted-foreground">{t("pages.comingSoon.description")}</p>
            </CardContent>
        </Card>
    );
}
