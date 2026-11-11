import { ChevronsUpDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "../hooks/use-current-user";
import { signOut } from "../lib/session";
import type { AuthUser } from "../types";
import { UserAvatar } from "./user-avatar";

export function UserMenu() {
    const { t } = useTranslation();
    const { isMobile } = useSidebar();
    const { user, roles } = useCurrentUser();
    const subtitle = user.designation ?? roles[0]?.name ?? user.email;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-14 rounded-xl bg-card text-sidebar-accent-foreground shadow-sm ring-1 ring-inset ring-sidebar-border hover:bg-card hover:ring-primary/30 data-[state=open]:ring-primary/40 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:ring-0"
                        >
                            <UserIdentity user={user} subtitle={subtitle} subtitleClassName="text-primary/70" />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-xl border-sidebar-border p-1.5 shadow-lg shadow-primary/10" side={isMobile ? "bottom" : "right"} align="end" sideOffset={10}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5">
                                <UserIdentity user={user} subtitle={user.email} />
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to={paths.profile}>
                                    <UserRound />
                                    {t("nav.profile")}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={`${paths.profile}?tab=security`}>
                                    <KeyRound />
                                    {t("nav.security")}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onSelect={() => void signOut()}>
                            <LogOut />
                            {t("actions.signOut")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function UserIdentity({ user, subtitle, subtitleClassName = "text-muted-foreground" }: { user: AuthUser; subtitle: string; subtitleClassName?: string }) {
    return (
        <>
            <UserAvatar user={user} className="size-8 rounded-lg ring-2 ring-primary/20" />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className={cn("truncate text-xs", subtitleClassName)}>{subtitle}</span>
            </div>
        </>
    );
}
