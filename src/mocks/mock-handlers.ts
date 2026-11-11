import type { Preferences } from "@/features/auth/types";
import type { ErrorCode } from "@/lib/api/error-codes";
import type { ErrorMeta, FieldError } from "@/lib/api/types";
import { db, DEMO_EMAIL, DEMO_OTP, DEMO_RESET_TOKEN, saveDb } from "./mock-db";

export type MockRequest = {
    body: Record<string, unknown>;
    params: Record<string, string>;
    token: string | null;
};

type Handler = (request: MockRequest) => unknown;

export class MockFailure {
    readonly status: number;
    readonly code: ErrorCode;
    readonly message: string;
    readonly details?: FieldError[];
    readonly meta?: ErrorMeta;

    constructor(status: number, code: ErrorCode, message: string, extra: { details?: FieldError[]; meta?: ErrorMeta } = {}) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.details = extra.details;
        this.meta = extra.meta;
    }
}

const ACCESS_TTL = 900;
let accessToken: string | null = null;

const issueToken = () => {
    accessToken = `mock-access-${crypto.randomUUID()}`;
    return { accessToken, expiresIn: ACCESS_TTL };
};

const signIn = (signedIn: boolean) => {
    db.signedIn = signedIn;
    if (!signedIn) accessToken = null;
    saveDb();
};

const authed = (handler: Handler): Handler => (request) => {
    if (!request.token) throw new MockFailure(401, "AUTH_TOKEN_MISSING", "Authentication required");
    if (!db.signedIn || request.token !== accessToken) throw new MockFailure(401, "AUTH_TOKEN_INVALID", "Invalid token");
    return handler(request);
};

const text = (value: unknown) => (typeof value === "string" ? value : "");

export const handlers: Record<string, Handler> = {
    "POST /auth/login": ({ body }) => {
        if (text(body.email).toLowerCase() !== DEMO_EMAIL || body.password !== db.password) {
            throw new MockFailure(401, "AUTH_INVALID_CREDENTIALS", "Email or password is incorrect");
        }
        signIn(true);
        return { ...issueToken(), ...db.me };
    },

    "POST /auth/refresh": () => {
        if (!db.signedIn) throw new MockFailure(401, "AUTH_REFRESH_INVALID", "Session expired, please sign in again");
        return issueToken();
    },

    "POST /auth/logout": () => {
        signIn(false);
        return null;
    },

    "POST /auth/logout-all": authed(() => {
        signIn(false);
        return { revokedSessions: db.sessions.length };
    }),

    "GET /auth/me": authed(() => db.me),

    "POST /auth/password/forgot": () => ({ otpExpiresIn: 600, resendAfter: 30 }),

    "POST /auth/password/verify-otp": ({ body }) => {
        if (body.otp !== DEMO_OTP) throw new MockFailure(422, "OTP_INVALID", "Incorrect code", { meta: { attemptsRemaining: 4 } });
        return { resetToken: DEMO_RESET_TOKEN, expiresIn: 600 };
    },

    "POST /auth/password/reset": ({ body }) => {
        if (body.resetToken !== DEMO_RESET_TOKEN) throw new MockFailure(422, "RESET_TOKEN_INVALID", "Reset link is invalid");
        db.password = text(body.newPassword);
        signIn(false);
        return null;
    },

    "PATCH /profile": authed(({ body }) => {
        const { preferences, ...user } = body as { preferences?: Partial<Preferences> };
        db.me = {
            ...db.me,
            user: { ...db.me.user, ...user },
            preferences: { ...db.me.preferences, ...preferences },
        };
        saveDb();
        return db.me;
    }),

    "POST /profile/avatar": authed(({ body }) => {
        const avatarUrl = URL.createObjectURL(body.avatar as File);
        db.me.user.avatarUrl = avatarUrl;
        return { avatarUrl };
    }),

    "POST /profile/password": authed(({ body }) => {
        if (body.currentPassword !== db.password) {
            throw new MockFailure(422, "PASSWORD_INCORRECT", "Current password is incorrect", {
                details: [{ field: "currentPassword", message: "Current password is incorrect" }],
            });
        }
        db.password = text(body.newPassword);
        db.sessions = db.sessions.filter((session) => session.isCurrent);
        saveDb();
        return issueToken();
    }),

    "GET /profile/sessions": authed(() => db.sessions),

    "GET /dashboard/summary": authed(() => ({
        totalAssets: 387,
        assetTypes: 8,
        inUse: 209,
        inStock: 157,
        faulty: 41,
        inRepair: 21,
        needsCheck: 22,
        pendingApprovals: 0,
    })),

    "DELETE /profile/sessions/:id": authed(({ params }) => {
        const exists = db.sessions.some((session) => session.id === params.id && !session.isCurrent);
        if (!exists) throw new MockFailure(404, "NOT_FOUND", "Session not found");
        db.sessions = db.sessions.filter((session) => session.id !== params.id);
        saveDb();
        return null;
    }),
};
