import { configureApiAuth } from "@/lib/api/auth-adapter";
import type { ErrorCode } from "@/lib/api/error-codes";
import { toAppError } from "@/lib/api/errors";
import { refreshAccessToken } from "@/lib/api/refresh";
import i18n from "@/lib/i18n";
import { queryClient } from "@/lib/query-client";
import { applyTheme } from "@/lib/theme";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { LoginData, Preferences, TokenData } from "../types";

type ChannelMessage = "login" | "logout";

const REFRESH_LEAD_SECONDS = 60;
const MIN_REFRESH_DELAY_SECONDS = 5;

const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("auth");
let refreshTimer: number | undefined;

const broadcast = (message: ChannelMessage) => channel?.postMessage(message);

function scheduleRefresh(expiresIn: number) {
    window.clearTimeout(refreshTimer);
    const delay = Math.max(expiresIn - REFRESH_LEAD_SECONDS, MIN_REFRESH_DELAY_SECONDS) * 1000;
    refreshTimer = window.setTimeout(() => void refreshAccessToken().catch(() => undefined), delay);
}

export function applyPreferences({ theme, language }: Preferences) {
    applyTheme(theme);
    void i18n.changeLanguage(language);
}

export function updateToken({ accessToken, expiresIn }: TokenData) {
    useAuthStore.getState().setToken(accessToken);
    scheduleRefresh(expiresIn);
}

export function startSession({ accessToken, expiresIn, ...me }: LoginData) {
    useAuthStore.getState().signIn(accessToken, me);
    applyPreferences(me.preferences);
    scheduleRefresh(expiresIn);
    broadcast("login");
}

export function endSession(reason: ErrorCode | null = null, notifyOtherTabs = true) {
    window.clearTimeout(refreshTimer);
    queryClient.clear();
    useAuthStore.getState().signOut(reason);
    if (notifyOtherTabs) broadcast("logout");
}

export async function restoreSession() {
    try {
        const accessToken = await refreshAccessToken();
        const me = await authApi.me();
        useAuthStore.getState().signIn(accessToken, me);
        applyPreferences(me.preferences);
    } catch (error) {
        if (toAppError(error).isUnexpected) throw error;
        endSession(null, false);
    }
}

export async function signOut() {
    await authApi.logout().catch(() => undefined);
    endSession();
}

export async function signOutEverywhere() {
    await authApi.logoutAll();
    endSession();
}

configureApiAuth({
    getToken: () => useAuthStore.getState().accessToken,
    setToken: updateToken,
    endSession: (code) => {
        if (useAuthStore.getState().status === "authenticated") endSession(code);
    },
});

channel?.addEventListener("message", ({ data }: MessageEvent<ChannelMessage>) => {
    if (data === "logout") endSession(null, false);
    if (data === "login") void restoreSession().catch(() => undefined);
});
