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
                            className="h-14 rounded-xl bg-white/[0.05] text-white ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:ring-0"
                        >
                            <UserIdentity user={user} subtitle={subtitle} subtitleClassName="text-emerald-200/60" />
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

function UserIdentity({ user, subtitle, subtitleClassName = "text-muted-foreground" }: { user: AuthUser; subtitle: string; subtitleClassName?: string }) {
    return (
        <>
            <UserAvatar user={user} className="size-8 rounded-lg ring-2 ring-emerald-400/40" />
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className={cn("truncate text-xs", subtitleClassName)}>{subtitle}</span>
            </div>
        </>
    );
}
