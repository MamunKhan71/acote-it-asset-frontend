import axios, { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { api } from "@/lib/api/client";
import { handlers, MockFailure, type MockRequest } from "./mock-handlers";

const LATENCY_MS = 300;
const apiBasePath = new URL(env.VITE_API_URL).pathname.replace(/\/$/, "");

const routes = Object.entries(handlers).map(([key, handler]) => {
    const [method, pattern] = key.split(" ");
    const names: string[] = [];
    const regex = new RegExp(`^${pattern.replace(/:(\w+)/g, (_, name: string) => (names.push(name), "([^/]+)"))}$`);
    return { method, regex, names, handler };
});

const pathOf = ({ url = "", baseURL = env.VITE_API_URL }: InternalAxiosRequestConfig) =>
    new URL(/^https?:/.test(url) ? url : `${baseURL}${url}`).pathname.slice(apiBasePath.length);

const bodyOf = (data: unknown): Record<string, unknown> => {
    if (data instanceof FormData) return Object.fromEntries(data.entries());
    return typeof data === "string" && data ? JSON.parse(data) : {};
};

const tokenOf = (config: InternalAxiosRequestConfig) =>
    AxiosHeaders.from(config.headers).get("Authorization")?.toString().replace("Bearer ", "") ?? null;

const respond = (config: InternalAxiosRequestConfig, status: number, data: unknown) => ({
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
});

const mockAdapter: AxiosAdapter = async (config) => {
    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

    const method = (config.method ?? "get").toUpperCase();
    const path = pathOf(config);
    const requestId = crypto.randomUUID();

    try {
        const route = routes.find((candidate) => candidate.method === method && candidate.regex.test(path));
        if (!route) throw new MockFailure(404, "NOT_FOUND", "Route not found");

        const values = path.match(route.regex)?.slice(1) ?? [];
        const request: MockRequest = {
            body: bodyOf(config.data),
            params: Object.fromEntries(route.names.map((name, index) => [name, values[index]])),
            token: tokenOf(config),
        };

        return respond(config, 200, {
            success: true,
            message: "OK",
            data: route.handler(request),
            requestId,
        });
    } catch (failure) {
        if (!(failure instanceof MockFailure)) throw failure;

        const response = respond(config, failure.status, {
            success: false,
            message: failure.message,
            error: { code: failure.code, details: failure.details, meta: failure.meta },
            requestId,
        });
        throw new AxiosError(failure.message, String(failure.status), config, null, response);
    }
};

export function enableMockApi() {
    axios.defaults.adapter = mockAdapter;
    api.defaults.adapter = mockAdapter;
}
