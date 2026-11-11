import type { ComponentType } from "react";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { PageLoader } from "@/components/feedback/page-loader";
import { navLinks } from "@/config/navigation";
import { paths } from "@/config/paths";
import type { RouteHandle } from "@/config/route-handle";
import { RequireAuth, RequireGuest } from "@/features/auth";
import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { NotFoundPage } from "@/pages/not-found.page";
import { PermissionGate } from "./permission-gate";

type PageModule = { default: ComponentType };

const page = (path: string, load: () => Promise<PageModule>, handle: RouteHandle = {}): RouteObject => ({
    path,
    handle,
    lazy: async () => ({ Component: (await load()).default }),
});

const guestPages: RouteObject[] = [
    page(paths.login, () => import("@/features/auth/pages/login.page"), { titleKey: "auth:login.title", subtitleKey: "auth:login.subtitle" }),
    page(paths.forgotPassword, () => import("@/features/auth/pages/forgot-password.page"), { titleKey: "auth:forgot.title", subtitleKey: "auth:forgot.subtitle" }),
    page(paths.verifyOtp, () => import("@/features/auth/pages/verify-otp.page"), { titleKey: "auth:verify.title", subtitleKey: "auth:verify.subtitle" }),
    page(paths.resetPassword, () => import("@/features/auth/pages/reset-password.page"), { titleKey: "auth:reset.title", subtitleKey: "auth:reset.subtitle" }),
];

const builtPages: Partial<Record<string, () => Promise<PageModule>>> = {
    [paths.dashboard]: () => import("@/features/dashboard/pages/dashboard.page"),
};

const comingSoon = () => import("@/pages/coming-soon.page");

const appPages: RouteObject[] = [
    ...navLinks.map(({ path, labelKey, permission }) => page(path, builtPages[path] ?? comingSoon, { titleKey: labelKey, permission })),
    page(paths.profile, () => import("@/features/auth/pages/profile.page"), { titleKey: "auth:profile.title" }),
];

export const router = createBrowserRouter([
    {
        HydrateFallback: PageLoader,
        children: [
            { index: true, element: <Navigate to={paths.dashboard} replace /> },
            { element: <RequireGuest />, children: [{ element: <AuthLayout />, children: guestPages }] },
            {
                element: <RequireAuth />,
                children: [{ element: <DashboardLayout />, children: [{ element: <PermissionGate />, children: appPages }] }],
            },
            { path: "*", Component: NotFoundPage },
        ],
    },
]);
