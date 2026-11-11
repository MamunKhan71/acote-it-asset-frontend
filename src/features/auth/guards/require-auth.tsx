import { Navigate, Outlet, useLocation } from "react-router-dom";
import { paths } from "@/config/paths";
import { useAuthStore } from "../store/auth.store";

export function RequireAuth() {
    const status = useAuthStore((state) => state.status);
    const endReason = useAuthStore((state) => state.endReason);
    const { pathname, search } = useLocation();

    if (status === "authenticated") return <Outlet />;

    const params = new URLSearchParams({ redirect: `${pathname}${search}` });
    if (endReason) params.set("reason", endReason);

    return <Navigate to={`${paths.login}?${params}`} replace />;
}
