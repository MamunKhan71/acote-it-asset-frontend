import { z } from "zod";

const PASSWORD_MIN = 10;
const PASSWORD_MAX = 128;

const required = z.string().trim().min(1, "validation.required");
const email = z.email("validation.email");
const newPassword = z.string().min(PASSWORD_MIN, "validation.passwordLength").max(PASSWORD_MAX, "validation.passwordLength");

const passwordPair = { newPassword, confirmPassword: required };
const passwordsMatch = (values: { newPassword: string; confirmPassword: string }) => values.newPassword === values.confirmPassword;
const mismatch = { path: ["confirmPassword"], message: "validation.passwordMismatch" };

export const loginSchema = z.object({
    email,
    password: required.max(PASSWORD_MAX, "validation.passwordLength"),
    rememberMe: z.boolean(),
});

export const forgotSchema = z.object({ email });

export const otpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "validation.otp"),
});

export const resetSchema = z.object(passwordPair).refine(passwordsMatch, mismatch);

export const changePasswordSchema = z.object({ currentPassword: required, ...passwordPair }).refine(passwordsMatch, mismatch);

export const profileSchema = z.object({
    name: z.string().trim().min(2, "validation.nameLength").max(100, "validation.nameLength"),
    phone: z.union([z.literal(""), z.string().regex(/^01\d{9}$/, "validation.phone")]),
    designation: z.string().trim().max(100, "validation.maxLength"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
