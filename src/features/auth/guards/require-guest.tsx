import { Navigate, Outlet } from "react-router-dom";
import { paths } from "@/config/paths";
import { useAuthStore } from "../store/auth.store";

export function RequireGuest() {
    const status = useAuthStore((state) => state.status);
    return status === "authenticated" ? <Navigate to={paths.dashboard} replace /> : <Outlet />;
}
