import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AppMark } from "@/components/brand/app-mark";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { hasChildren, navigation, type NavItem, type NavLink } from "@/config/navigation";
import { paths } from "@/config/paths";
import { usePermission, UserMenu } from "@/features/auth";

function useVisibleNavigation() {
    const { can } = usePermission();
    const allowed = (link: NavLink) => !link.permission || can(link.permission);

    const visible = (item: NavItem): NavItem | null => {
        if (!hasChildren(item)) return allowed(item) ? item : null;
        const children = item.children.filter(allowed);
        return children.length ? { ...item, children } : null;
    };

    return navigation
        .map((group) => ({ ...group, items: group.items.map(visible).filter((item): item is NavItem => item !== null) }))
        .filter((group) => group.items.length > 0);
}

export function AppSidebar() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const groups = useVisibleNavigation();

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to={paths.dashboard}>
                                <AppMark />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{t("app.name")}</span>
                                    <span className="truncate text-xs text-muted-foreground">{t("app.tagline")}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {groups.map((group) => (
                    <SidebarGroup key={group.labelKey}>
                        <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) =>
                                hasChildren(item) ? (
                                    <Collapsible key={item.labelKey} asChild defaultOpen={item.children.some((child) => isActive(child.path))} className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={t(item.labelKey)}>
                                                    <item.icon />
                                                    <span>{t(item.labelKey)}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.children.map((child) => (
                                                        <SidebarMenuSubItem key={child.path}>
                                                            <SidebarMenuSubButton asChild isActive={isActive(child.path)}>
                                                                <Link to={child.path}>
                                                                    <span>{t(child.labelKey)}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.path}>
                                        <SidebarMenuButton asChild tooltip={t(item.labelKey)} isActive={isActive(item.path)}>
                                            <Link to={item.path}>
                                                <item.icon />
                                                <span>{t(item.labelKey)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <UserMenu />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
