import type { Me, SessionItem } from "@/features/auth/types";

export const DEMO_EMAIL = "demo@acote.com";
export const DEMO_PASSWORD = "Password@123";
export const DEMO_OTP = "123456";
export const DEMO_RESET_TOKEN = "mock-reset-token";

type MockDb = {
    password: string;
    signedIn: boolean;
    me: Me;
    sessions: SessionItem[];
};

const STORAGE_KEY = "mock-db";
const now = new Date().toISOString();

const initialDb: MockDb = {
    password: DEMO_PASSWORD,
    signedIn: false,
    me: {
        user: {
            id: "665f1c2ab4e8a1d2c3f40001",
            name: "Demo Admin",
            email: DEMO_EMAIL,
            phone: "01700000000",
            designation: "IT Admin",
            avatarUrl: null,
            isActive: true,
            lastLoginAt: now,
            createdAt: "2026-01-01T00:00:00.000Z",
        },
        preferences: { theme: "light", language: "en", dateFormat: "DD/MM/YYYY", timeFormat: "12h", emailNotification: true },
        roles: [{ id: "6661c0a1b2c3d4e5f6a70001", name: "Super Admin", slug: "super-admin" }],
        permissions: [
            "access-control.permission.list",
            "access-control.role.list",
            "access-control.user.list",
            "approvals.request.list",
            "assets.asset.list",
            "dashboard.dashboard.view",
            "handover.handover.list",
            "history.activity.list",
            "people.employee.list",
            "repairs.repair.list",
            "settings.settings.view",
        ],
    },
    sessions: [
        { id: "s1", device: "Chrome on Windows", ip: "127.0.0.1", lastUsedAt: now, createdAt: now, isCurrent: true },
        { id: "s2", device: "Safari on iPhone", ip: "103.4.145.2", lastUsedAt: "2026-11-09T08:15:00.000Z", createdAt: "2026-11-01T08:15:00.000Z", isCurrent: false },
    ],
};

const load = (): MockDb => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(initialDb);
    const stored = JSON.parse(saved) as MockDb;
    return { ...stored, me: { ...stored.me, permissions: initialDb.me.permissions } };
};

export const db = load();

export const saveDb = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...db, me: { ...db.me, user: { ...db.me.user, avatarUrl: null } } }));
