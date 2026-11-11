import { http } from "@/lib/api/client";
import type {
    ChangePasswordRequest,
    ForgotData,
    ForgotRequest,
    LoginData,
    LoginRequest,
    Me,
    ProfileUpdateRequest,
    ResetRequest,
    ResetTokenData,
    SessionItem,
    TokenData,
    VerifyOtpRequest,
} from "../types";

export const authKeys = {
    sessions: ["auth", "sessions"] as const,
};

export const authApi = {
    login: (body: LoginRequest) => http.post<LoginData>("/auth/login", body),
    logout: () => http.post<null>("/auth/logout"),
    logoutAll: () => http.post<{ revokedSessions: number }>("/auth/logout-all"),
    me: () => http.get<Me>("/auth/me"),
    forgotPassword: (body: ForgotRequest) => http.post<ForgotData>("/auth/password/forgot", body),
    verifyOtp: (body: VerifyOtpRequest) => http.post<ResetTokenData>("/auth/password/verify-otp", body),
    resetPassword: (body: ResetRequest) => http.post<null>("/auth/password/reset", body),
};

export const profileApi = {
    update: (body: ProfileUpdateRequest) => http.patch<Me>("/profile", body),
    uploadAvatar: (file: File) => {
        const body = new FormData();
        body.append("avatar", file);
        return http.post<{ avatarUrl: string }>("/profile/avatar", body);
    },
    changePassword: (body: ChangePasswordRequest) => http.post<TokenData>("/profile/password", body),
    sessions: () => http.get<SessionItem[]>("/profile/sessions"),
    revokeSession: (id: string) => http.delete<null>(`/profile/sessions/${id}`),
};
