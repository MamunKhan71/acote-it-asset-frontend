import type { ErrorCode } from "./error-codes";
import type { TokenData } from "./types";

type ApiAuthAdapter = {
    getToken: () => string | null;
    setToken: (token: TokenData) => void;
    endSession: (code: ErrorCode) => void;
};

export const apiAuth: ApiAuthAdapter = {
    getToken: () => null,
    setToken: () => undefined,
    endSession: () => undefined,
};

export const configureApiAuth = (adapter: ApiAuthAdapter) => Object.assign(apiAuth, adapter);
