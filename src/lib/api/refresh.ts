import axios from "axios";
import { env } from "@/config/env";
import { apiAuth } from "./auth-adapter";
import { toAppError } from "./errors";
import type { SuccessResponse, TokenData } from "./types";

let inflight: Promise<string> | null = null;

export function refreshAccessToken() {
    inflight ??= axios
        .post<SuccessResponse<TokenData>>(`${env.VITE_API_URL}/auth/refresh`, null, { withCredentials: true })
        .then(({ data }) => {
            apiAuth.setToken(data.data);
            return data.data.accessToken;
        })
        .catch((error: unknown) => {
            const appError = toAppError(error);
            if (!appError.isUnexpected) apiAuth.endSession(appError.code);
            throw appError;
        })
        .finally(() => {
            inflight = null;
        });

    return inflight;
}
