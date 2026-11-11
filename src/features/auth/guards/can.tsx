import type { ReactNode } from "react";
import { usePermission } from "../hooks/use-permission";

type CanProps = {
    perm?: string;
    anyOf?: string[];
    allOf?: string[];
    fallback?: ReactNode;
    children: ReactNode;
};

export function Can({ perm, anyOf = [], allOf = [], fallback = null, children }: CanProps) {
    const { can, canAny, canAll } = usePermission();
    const allowed = (!perm || can(perm)) && (!anyOf.length || canAny(...anyOf)) && canAll(...allOf);
    return <>{allowed ? children : fallback}</>;
}
