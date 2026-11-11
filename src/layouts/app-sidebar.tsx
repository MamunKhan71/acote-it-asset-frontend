import { ChevronRight, type LucideIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

const itemClass = cn(
    "group/nav relative h-10 gap-3 rounded-xl px-1.5 text-[14px] font-medium text-sidebar-foreground transition-all duration-200",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "data-[active=true]:bg-card data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-[0_1px_2px_hsl(var(--sidebar-foreground)/0.06),0_4px_12px_-4px_hsl(var(--primary)/0.18)] data-[active=true]:ring-1 data-[active=true]:ring-sidebar-border",
    "data-[state=open]:hover:bg-sidebar-accent",
    "before:absolute before:-left-2 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-r-full before:bg-primary before:opacity-0 before:transition-opacity data-[active=true]:before:opacity-100",
    "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:before:hidden",
);

const subItemClass = cn(
    "group/sub h-9 gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium text-sidebar-foreground/85 transition-colors",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "data-[active=true]:bg-card data-[active=true]:font-semibold data-[active=true]:text-primary data-[active=true]:ring-1 data-[active=true]:ring-sidebar-border",
);

function NavIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <span
            className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg bg-card/80 text-sidebar-foreground/80 ring-1 ring-inset ring-sidebar-border transition-all duration-200",
                "group-hover/nav:text-primary",
                "group-data-[active=true]/nav:bg-gradient-to-br group-data-[active=true]/nav:from-emerald-500 group-data-[active=true]/nav:to-teal-600 group-data-[active=true]/nav:text-white group-data-[active=true]/nav:shadow-[0_4px_12px_-3px_hsl(var(--primary)/0.55)] group-data-[active=true]/nav:ring-0",
            )}
        >
            <Icon className="size-[18px]" strokeWidth={2} />
        </span>
    );
}

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
            <SidebarHeader className="pb-0">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-12 rounded-xl hover:bg-sidebar-accent group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0.5!">
                            <Link to={paths.dashboard}>
                                <AppMark />
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate text-[16px] font-bold tracking-tight text-sidebar-accent-foreground">{t("app.name")}</span>
                                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-primary/70">{t("app.tagline")}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="gap-1 [scrollbar-color:hsl(var(--sidebar-border))_transparent] [scrollbar-width:thin]">
                {groups.map((group) => (
                    <SidebarGroup key={group.labelKey}>
                        <SidebarGroupLabel className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/65">
                            {t(group.labelKey)}
                        </SidebarGroupLabel>
                        <SidebarMenu className="gap-1">
                            {group.items.map((item) =>
                                hasChildren(item) ? (
                                    <Collapsible key={item.labelKey} asChild defaultOpen={item.children.some((child) => isActive(child.path))} className="group/collapsible">
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={t(item.labelKey)} className={itemClass}>
                                                    <NavIcon icon={item.icon} />
                                                    <span>{t(item.labelKey)}</span>
                                                    <ChevronRight className="ml-auto size-4 opacity-50 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub className="ml-5 mt-1 gap-0.5 border-l border-sidebar-border pl-3">
                                                    {item.children.map((child) => (
                                                        <SidebarMenuSubItem key={child.path}>
                                                            <SidebarMenuSubButton asChild isActive={isActive(child.path)} className={subItemClass}>
                                                                <Link to={child.path}>
                                                                    <span className="size-1.5 shrink-0 rounded-full bg-current opacity-60 group-data-[active=true]/sub:opacity-100" />
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
                                        <SidebarMenuButton asChild tooltip={t(item.labelKey)} isActive={isActive(item.path)} className={itemClass}>
                                            <Link to={item.path}>
                                                <NavIcon icon={item.icon} />
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
            <SidebarFooter className="p-3">
                <UserMenu />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
