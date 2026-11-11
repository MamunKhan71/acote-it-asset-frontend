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
    "group/nav relative h-10 gap-3 rounded-xl px-2 text-[13.5px] font-medium text-sidebar-foreground/70 transition-all duration-200",
    "hover:bg-white/[0.04] hover:text-white",
    "data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-400/20 data-[active=true]:via-emerald-400/[0.07] data-[active=true]:to-transparent data-[active=true]:font-semibold data-[active=true]:text-white",
    "data-[state=open]:text-white data-[state=open]:hover:bg-white/[0.04]",
    "before:absolute before:-left-2 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-emerald-400 before:opacity-0 before:shadow-[0_0_12px_2px_rgba(52,211,153,0.6)] before:transition-opacity data-[active=true]:before:opacity-100",
    "group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:before:hidden",
);

const subItemClass = cn(
    "group/sub h-9 gap-2.5 rounded-lg px-2.5 text-[13px] text-sidebar-foreground/60 transition-colors",
    "hover:bg-white/[0.04] hover:text-white",
    "data-[active=true]:bg-white/[0.06] data-[active=true]:font-medium data-[active=true]:text-emerald-300",
);

function NavIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <span
            className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-sidebar-foreground/70 ring-1 ring-inset ring-white/[0.06] transition-all duration-200",
                "group-hover/nav:bg-white/10 group-hover/nav:text-white",
                "group-data-[active=true]/nav:bg-gradient-to-br group-data-[active=true]/nav:from-emerald-300 group-data-[active=true]/nav:to-emerald-500 group-data-[active=true]/nav:text-emerald-950 group-data-[active=true]/nav:shadow-[0_4px_14px_-2px_rgba(52,211,153,0.55)] group-data-[active=true]/nav:ring-emerald-200/40",
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
            <SidebarHeader className="pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="h-14 rounded-xl hover:bg-white/[0.04] group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-0.5!">
                            <Link to={paths.dashboard}>
                                <AppMark />
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate text-[15px] font-bold tracking-tight text-white">{t("app.name")}</span>
                                    <span className="truncate text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-300/70">{t("app.tagline")}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <div className="mx-2 mt-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </SidebarHeader>
            <SidebarContent className="gap-1 [scrollbar-color:rgb(255_255_255/0.12)_transparent] [scrollbar-width:thin]">
                {groups.map((group) => (
                    <SidebarGroup key={group.labelKey}>
                        <SidebarGroupLabel className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/35">
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
                                                <SidebarMenuSub className="ml-6 mt-1 gap-0.5 border-l border-white/10 pl-3">
                                                    {item.children.map((child) => (
                                                        <SidebarMenuSubItem key={child.path}>
                                                            <SidebarMenuSubButton asChild isActive={isActive(child.path)} className={subItemClass}>
                                                                <Link to={child.path}>
                                                                    <span className="size-1.5 shrink-0 rounded-full bg-current opacity-40 group-data-[active=true]/sub:opacity-100 group-data-[active=true]/sub:shadow-[0_0_8px_rgba(110,231,183,0.9)]" />
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
