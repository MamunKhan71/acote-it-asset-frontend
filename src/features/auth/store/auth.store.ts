import { create } from "zustand";
import type { ErrorCode } from "@/lib/api/error-codes";
import type { Me } from "../types";

type AuthStatus = "loading" | "authenticated" | "guest";

type AuthState = {
    status: AuthStatus;
    accessToken: string | null;
    me: Me | null;
    endReason: ErrorCode | null;
    signIn: (accessToken: string, me: Me) => void;
    setToken: (accessToken: string) => void;
    setMe: (next: Me | ((me: Me) => Me)) => void;
    signOut: (reason: ErrorCode | null) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
    status: "loading",
    accessToken: null,
    me: null,
    endReason: null,
    signIn: (accessToken, me) => set({ status: "authenticated", accessToken, me, endReason: null }),
    setToken: (accessToken) => set({ accessToken }),
    setMe: (next) => set(({ me }) => ({ me: typeof next === "function" ? me && next(me) : next })),
    signOut: (endReason) => set({ status: "guest", accessToken: null, me: null, endReason }),
}));
