import { useMemo } from "react";
import { useAuthStore } from "../store/auth.store";

export function usePermission() {
    const permissions = useAuthStore((state) => state.me?.permissions);

    return useMemo(() => {
        const granted = new Set(permissions);
        return {
            can: (permission: string) => granted.has(permission),
            canAny: (...required: string[]) => required.some((permission) => granted.has(permission)),
            canAll: (...required: string[]) => required.every((permission) => granted.has(permission)),
        };
    }, [permissions]);
}
