import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import i18n from "@/lib/i18n";
import { apiAuth } from "./auth-adapter";
import { SESSION_ENDED_CODES } from "./error-codes";
import { toAppError } from "./errors";
import { refreshAccessToken } from "./refresh";
import type { ListParams, ListResponse, SuccessResponse } from "./types";

type RetryableConfig = InternalAxiosRequestConfig & { retried?: boolean };

const PUBLIC_AUTH_URLS = ["/auth/login", "/auth/refresh", "/auth/password/"];

const isPublicAuthUrl = (url = "") => PUBLIC_AUTH_URLS.some((publicUrl) => url.startsWith(publicUrl));

export const api = axios.create({
    baseURL: env.VITE_API_URL,
    withCredentials: true,
    timeout: 20_000,
});

api.interceptors.request.use((config) => {
    const token = apiAuth.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Accept-Language"] = i18n.language;
    return config;
});

api.interceptors.response.use(undefined, async (error) => {
    const appError = toAppError(error);
    const config = error.config as RetryableConfig | undefined;

    if (!config || isPublicAuthUrl(config.url)) throw appError;

    if (appError.code === "AUTH_TOKEN_EXPIRED" && !config.retried) {
        config.retried = true;
        config.headers.Authorization = `Bearer ${await refreshAccessToken()}`;
        return api(config);
    }

    if (SESSION_ENDED_CODES.includes(appError.code)) apiAuth.endSession(appError.code);

    throw appError;
});

export const toQuery = ({ filter, ...params }: ListParams = {}) => ({
    ...params,
    ...Object.fromEntries(Object.entries(filter ?? {}).map(([key, value]) => [`filter[${key}]`, value])),
});

const unwrap = <T>(request: Promise<{ data: SuccessResponse<T> }>) => request.then(({ data }) => data.data);

export const http = {
    get: <T>(url: string, config?: AxiosRequestConfig) => unwrap<T>(api.get(url, config)),
    post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => unwrap<T>(api.post(url, body, config)),
    put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => unwrap<T>(api.put(url, body, config)),
    patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) => unwrap<T>(api.patch(url, body, config)),
    delete: <T>(url: string, config?: AxiosRequestConfig) => unwrap<T>(api.delete(url, config)),
    list: <T>(url: string, params?: ListParams) =>
        api.get<ListResponse<T>>(url, { params: toQuery(params) }).then(({ data }) => data),
};
