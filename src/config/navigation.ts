import {
    ArrowLeftRight,
    Boxes,
    ClipboardCheck,
    History,
    KeyRound,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    UserCog,
    Users,
    Wrench,
    type LucideIcon,
} from "lucide-react";
import { paths } from "./paths";

export type NavLink = {
    labelKey: string;
    path: string;
    icon: LucideIcon;
    permission?: string;
};

export type NavItem = NavLink | (Omit<NavLink, "path" | "permission"> & { children: NavLink[] });

export type NavGroup = {
    labelKey: string;
    items: NavItem[];
};

export const navigation: NavGroup[] = [
    {
        labelKey: "nav.groups.main",
        items: [
            { labelKey: "nav.overview", path: paths.dashboard, icon: LayoutDashboard, permission: "dashboard.dashboard.view" },
            { labelKey: "nav.assets", path: paths.assets, icon: Boxes, permission: "assets.asset.list" },
            { labelKey: "nav.repairs", path: paths.repairs, icon: Wrench, permission: "repairs.repair.list" },
            { labelKey: "nav.handover", path: paths.handover, icon: ArrowLeftRight, permission: "handover.handover.list" },
            { labelKey: "nav.people", path: paths.people, icon: Users, permission: "people.employee.list" },
            { labelKey: "nav.approvals", path: paths.approvals, icon: ClipboardCheck, permission: "approvals.request.list" },
            { labelKey: "nav.history", path: paths.history, icon: History, permission: "history.activity.list" },
        ],
    },
    {
        labelKey: "nav.groups.admin",
        items: [
            {
                labelKey: "nav.admin",
                icon: ShieldCheck,
                children: [
                    { labelKey: "nav.users", path: paths.users, icon: UserCog, permission: "access-control.user.list" },
                    { labelKey: "nav.roles", path: paths.roles, icon: ShieldCheck, permission: "access-control.role.list" },
                    { labelKey: "nav.permissions", path: paths.permissions, icon: KeyRound, permission: "access-control.permission.list" },
                    { labelKey: "nav.settings", path: paths.settings, icon: Settings, permission: "settings.settings.view" },
                ],
            },
        ],
    },
];

export const hasChildren = (item: NavItem): item is Extract<NavItem, { children: NavLink[] }> => "children" in item;

export const navLinks: NavLink[] = navigation.flatMap((group) => group.items.flatMap((item) => (hasChildren(item) ? item.children : [item])));
