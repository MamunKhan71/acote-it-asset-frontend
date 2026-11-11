import { Outlet } from "react-router-dom";
import { usePermission } from "@/features/auth";
import { useRoutePermissions } from "@/hooks/use-route-handle";
import { ForbiddenPage } from "@/pages/forbidden.page";

export function PermissionGate() {
    const required = useRoutePermissions();
    const { canAll } = usePermission();
    return canAll(...required) ? <Outlet /> : <ForbiddenPage />;
}
