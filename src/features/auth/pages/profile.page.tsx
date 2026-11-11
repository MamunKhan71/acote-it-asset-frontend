import type { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "../components/profile/change-password-form";
import { PreferencesForm } from "../components/profile/preferences-form";
import { ProfileDetails } from "../components/profile/profile-details";
import { SessionsList } from "../components/profile/sessions-list";

const TABS = {
    details: ProfileDetails,
    preferences: PreferencesForm,
    security: ChangePasswordForm,
    sessions: SessionsList,
} satisfies Record<string, ComponentType>;

type Tab = keyof typeof TABS;

const isTab = (value: string | null): value is Tab => !!value && value in TABS;

export default function ProfilePage() {
    const { t } = useTranslation("auth");
    const [params, setParams] = useSearchParams();
    const requested = params.get("tab");
    const active: Tab = isTab(requested) ? requested : "details";

    return (
        <Tabs value={active} onValueChange={(tab) => setParams({ tab }, { replace: true })}>
            <TabsList>
                {Object.keys(TABS).map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                        {t(`profile.tabs.${tab}`)}
                    </TabsTrigger>
                ))}
            </TabsList>
            {Object.entries(TABS).map(([tab, Panel]) => (
                <TabsContent key={tab} value={tab}>
                    <Card>
                        <CardContent className="pt-6">
                            <Panel />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
}
