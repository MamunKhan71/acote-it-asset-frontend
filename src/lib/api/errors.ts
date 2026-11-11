import { isAxiosError } from "axios";
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import i18n from "@/lib/i18n";
import type { ErrorCode } from "./error-codes";
import type { ErrorMeta, ErrorResponse, FieldError } from "./types";

export class AppError extends Error {
    readonly status: number;
    readonly code: ErrorCode;
    readonly details: FieldError[];
    readonly meta: ErrorMeta;
    readonly requestId?: string;

    constructor(status: number, code: ErrorCode, message: string, details: FieldError[] = [], meta: ErrorMeta = {}, requestId?: string) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
        this.meta = meta;
        this.requestId = requestId;
    }

    get isUnexpected() {
        return this.status === 0 || this.status >= 500;
    }
}

export function toAppError(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (isAxiosError<ErrorResponse>(error) && error.response) {
        const { status, data } = error.response;

        if (data?.error) {
            return new AppError(status, data.error.code, data.message, data.error.details, data.error.meta, data.requestId);
        }

        return new AppError(status, "INTERNAL_ERROR", error.message);
    }

    return new AppError(0, "NETWORK_ERROR", error instanceof Error ? error.message : "Network error");
}

export function applyFieldErrors<T extends FieldValues>(error: AppError, setError: UseFormSetError<T>) {
    error.details.forEach(({ field, message }) => setError(field as FieldPath<T>, { type: "server", message }));
    return error.details.length > 0;
}

export function describeError(error: AppError) {
    return i18n.t(`errors.${error.code}`, {
        ns: "common",
        defaultValue: error.message,
        requestId: error.requestId ?? "-",
        ...error.meta,
    });
}
