import { http } from "@/lib/api/client";

export type DashboardSummary = {
    totalAssets: number;
    assetTypes: number;
    inUse: number;
    inStock: number;
    faulty: number;
    inRepair: number;
    needsCheck: number;
    pendingApprovals: number;
};

export const dashboardKeys = {
    summary: ["dashboard", "summary"] as const,
};

export const dashboardApi = {
    summary: () => http.get<DashboardSummary>("/dashboard/summary"),
};
