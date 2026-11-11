import type { ErrorCode } from "./error-codes";

export type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
    requestId: string;
};

export type Pagination = {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
};

export type ListResponse<T> = {
    success: true;
    message: string;
    data: T[];
    meta?: { pagination: Pagination };
    requestId: string;
};

export type FieldError = {
    field: string;
    message: string;
};

export type ErrorMeta = {
    retryAfter?: number;
    attemptsRemaining?: number;
    required?: string;
    count?: number;
};

export type ErrorResponse = {
    success: false;
    message: string;
    error: {
        code: ErrorCode;
        details?: FieldError[];
        meta?: ErrorMeta;
    };
    requestId: string;
};

export type ListParams = {
    page?: number;
    perPage?: number;
    search?: string;
    sort?: string;
    filter?: Record<string, string | number | boolean>;
    all?: boolean;
};

export type TokenData = {
    accessToken: string;
    expiresIn: number;
};
