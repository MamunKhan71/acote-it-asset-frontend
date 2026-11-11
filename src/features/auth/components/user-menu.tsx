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
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <UserIdentity user={user} subtitle={subtitle} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
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

function UserIdentity({ user, subtitle }: { user: AuthUser; subtitle: string }) {
    return (
        <>
            <UserAvatar user={user} className="size-8 rounded-lg" />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
            </div>
        </>
    );
}
