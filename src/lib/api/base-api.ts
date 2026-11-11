import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig } from "axios";
import type { z } from "zod";
import { api } from "./client";
import type { ErrorCode } from "./error-codes";
import { toAppError } from "./errors";
import type { ErrorMeta, FieldError } from "./types";

export type ApiError = {
    status: number;
    code: ErrorCode;
    message: string;
    details: FieldError[];
    meta: ErrorMeta;
    requestId?: string;
};

export type ApiRequest = {
    url: string;
    method?: AxiosRequestConfig["method"];
    body?: unknown;
    params?: Record<string, unknown>;
    schema?: z.ZodType;
};

const invalidResponse = (url: string, issues: z.core.$ZodIssue[]): ApiError => {
    if (import.meta.env.DEV) console.error(`Response from ${url} does not match the contract`, issues);
    return { status: 200, code: "INVALID_RESPONSE", message: "Unexpected response from the server", details: [], meta: {} };
};

const axiosBaseQuery: BaseQueryFn<ApiRequest, unknown, ApiError> = async ({ url, method = "GET", body, params, schema }) => {
    try {
        const { data } = await api.request({ url, method, data: body, params });
        if (!schema) return { data };
        const parsed = schema.safeParse(data);
        return parsed.success ? { data: parsed.data } : { error: invalidResponse(url, parsed.error.issues) };
    } catch (cause) {
        const { status, code, message, details, meta, requestId } = toAppError(cause);
        return { error: { status, code, message, details, meta, requestId } };
    }
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery,
    tagTypes: ["Activity"],
    endpoints: () => ({}),
});
