import { useAuthStore } from "../store/auth.store";
import type { Me } from "../types";

export function useCurrentUser(): Me {
    const me = useAuthStore((state) => state.me);
    if (!me) throw new Error("useCurrentUser must be used inside an authenticated route");
    return me;
}
