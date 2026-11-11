import type { TokenData } from "@/lib/api/types";
import type { Language } from "@/lib/i18n";
import type { Theme } from "@/lib/theme";

export type { TokenData };

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    designation: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
};

export type Preferences = {
    theme: Theme;
    language: Language;
    dateFormat: string;
    timeFormat: "12h" | "24h";
    emailNotification: boolean;
};

export type RoleRef = {
    id: string;
    name: string;
    slug: string;
};

export type Me = {
    user: AuthUser;
    preferences: Preferences;
    roles: RoleRef[];
    permissions: string[];
};

export type LoginData = TokenData & Me;

export type ForgotData = {
    otpExpiresIn: number;
    resendAfter: number;
};

export type ResetTokenData = {
    resetToken: string;
    expiresIn: number;
};

export type SessionItem = {
    id: string;
    device: string;
    ip: string;
    lastUsedAt: string;
    createdAt: string;
    isCurrent: boolean;
};

export type LoginRequest = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export type ForgotRequest = {
    email: string;
};

export type VerifyOtpRequest = {
    email: string;
    otp: string;
};

export type ResetRequest = {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
};

export type ProfileUpdateRequest = {
    name?: string;
    phone?: string | null;
    designation?: string | null;
    preferences?: Partial<Preferences>;
};

export type LoginLocationState = { notice?: string; email?: string } | null;

export type VerifyOtpLocationState = { email: string; resendAfter: number } | null;

export type ResetLocationState = { resetToken: string; email: string } | null;

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};
