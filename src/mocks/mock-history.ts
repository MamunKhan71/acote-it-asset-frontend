import { activityRowSchema, type ActivityCategory, type ActivityDetail, type ActivityRow, type ChangeValue, type Subject } from "@/features/history/schemas/history.schema";

type Actor = { id: string; name: string; avatarUrl: null };
type Change = { field: string; label: string; from: ChangeValue; to: ChangeValue };

type Template = {
    category: ActivityCategory;
    action: string;
    build: (pick: Picker) => {
        description: string;
        subject: Subject;
        related?: Subject[];
        changes?: Change[];
        note?: string;
        system?: boolean;
    };
};

type Picker = <T>(items: readonly T[]) => T;

const users: Actor[] = [
    { id: "u_01", name: "Demo Admin", avatarUrl: null },
    { id: "u_02", name: "Farhana Akter", avatarUrl: null },
    { id: "u_03", name: "Rakib Hasan", avatarUrl: null },
    { id: "u_04", name: "Nusrat Jahan", avatarUrl: null },
    { id: "u_05", name: "Tanvir Ahmed", avatarUrl: null },
];

const sites = [
    { id: "site_dhk", name: "Dhaka HQ" },
    { id: "site_ctg", name: "Chattogram Office" },
    { id: "site_syl", name: "Sylhet Branch" },
];

const assets = [
    "LT-0042 · Dell Latitude 5440",
    "LT-0057 · Lenovo ThinkPad T14",
    "LT-0063 · HP EliteBook 840",
    "MN-0118 · Dell P2422H Monitor",
    "MN-0121 · LG 27UP550 Monitor",
    "PR-0009 · HP LaserJet M404",
    "PH-0210 · iPhone 13",
    "PH-0214 · Samsung Galaxy A54",
    "DT-0031 · Dell OptiPlex 7010",
    "RT-0004 · MikroTik hAP ax2",
].map((label, index) => ({ type: "asset" as const, id: `as_${index + 1}`, label }));

const employees = [
    "Sadia Islam (EMP-1021)",
    "Mahmudul Karim (EMP-1034)",
    "Ayesha Siddiqua (EMP-1048)",
    "Imran Chowdhury (EMP-1052)",
    "Lamia Rahman (EMP-1067)",
    "Shafiqul Alam (EMP-1073)",
].map((label, index) => ({ type: "employee" as const, id: `emp_${index + 1}`, label }));

const vendors = ["TechCare Ltd", "Smart Fix BD", "Dell Service Center"];
const conditions = ["Good", "Fair", "Faulty"];

const templates: Template[] = [
    {
        category: "asset",
        action: "asset.created",
        build: (pick) => {
            const asset = pick(assets);
            return { description: `Added ${asset.label} to inventory`, subject: asset, changes: [{ field: "status", label: "Status", from: null, to: "In stock" }] };
        },
    },
    {
        category: "asset",
        action: "asset.updated",
        build: (pick) => {
            const asset = pick(assets);
            return {
                description: `Updated details of ${asset.label}`,
                subject: asset,
                changes: [
                    { field: "condition", label: "Condition", from: "Good", to: pick(conditions) },
                    { field: "warrantyEnd", label: "Warranty end", from: "2026-12-31", to: "2027-12-31" },
                ],
            };
        },
    },
    {
        category: "asset",
        action: "asset.status_changed",
        build: (pick) => {
            const asset = pick(assets);
            return { description: `Marked ${asset.label} as faulty`, subject: asset, changes: [{ field: "status", label: "Status", from: "In use", to: "Faulty" }] };
        },
    },
    {
        category: "handover",
        action: "handover.issued",
        build: (pick) => {
            const asset = pick(assets);
            const employee = pick(employees);
            return {
                description: `Handed ${asset.label} to ${employee.label}`,
                subject: asset,
                related: [employee],
                changes: [
                    { field: "assignedTo", label: "Assigned to", from: null, to: employee.label },
                    { field: "status", label: "Status", from: "In stock", to: "In use" },
                ],
            };
        },
    },
    {
        category: "handover",
        action: "handover.returned",
        build: (pick) => {
            const asset = pick(assets);
            const employee = pick(employees);
            return {
                description: `${employee.label} returned ${asset.label}`,
                subject: asset,
                related: [employee],
                changes: [
                    { field: "assignedTo", label: "Assigned to", from: employee.label, to: null },
                    { field: "status", label: "Status", from: "In use", to: "Needs check" },
                ],
                note: "Charger missing on return.",
            };
        },
    },
    {
        category: "repair",
        action: "repair.opened",
        build: (pick) => {
            const asset = pick(assets);
            const vendor = pick(vendors);
            return {
                description: `Sent ${asset.label} to ${vendor} for repair`,
                subject: { type: "repair", id: `rp_${asset.id}`, label: `Repair for ${asset.label.split(" · ")[0]}` },
                related: [asset],
                changes: [{ field: "status", label: "Status", from: "Faulty", to: "In repair" }],
                note: "Screen flickers after 10 minutes of use.",
            };
        },
    },
    {
        category: "repair",
        action: "repair.completed",
        build: (pick) => {
            const asset = pick(assets);
            return {
                description: `Repair completed for ${asset.label}`,
                subject: { type: "repair", id: `rp_${asset.id}`, label: `Repair for ${asset.label.split(" · ")[0]}` },
                related: [asset],
                changes: [
                    { field: "status", label: "Status", from: "In repair", to: "In stock" },
                    { field: "cost", label: "Cost (BDT)", from: null, to: 4500 },
                ],
            };
        },
    },
    {
        category: "approval",
        action: "approval.requested",
        build: (pick) => {
            const asset = pick(assets);
            return {
                description: `Requested approval to dispose ${asset.label}`,
                subject: { type: "approval", id: `ap_${asset.id}`, label: `Dispose ${asset.label.split(" · ")[0]}` },
                related: [asset],
            };
        },
    },
    {
        category: "approval",
        action: "approval.approved",
        build: (pick) => {
            const asset = pick(assets);
            return {
                description: `Approved disposal of ${asset.label}`,
                subject: { type: "approval", id: `ap_${asset.id}`, label: `Dispose ${asset.label.split(" · ")[0]}` },
                related: [asset],
                changes: [{ field: "status", label: "Status", from: "Pending", to: "Approved" }],
                note: "Beyond economical repair.",
            };
        },
    },
    {
        category: "people",
        action: "employee.updated",
        build: (pick) => {
            const employee = pick(employees);
            return {
                description: `Updated department of ${employee.label}`,
                subject: employee,
                changes: [{ field: "department", label: "Department", from: "Finance", to: "Operations" }],
            };
        },
    },
    {
        category: "people",
        action: "employee.deactivated",
        build: (pick) => {
            const employee = pick(employees);
            return {
                description: `Deactivated ${employee.label}`,
                subject: employee,
                changes: [{ field: "isActive", label: "Active", from: true, to: false }],
                note: "Resigned. All assets must be returned.",
            };
        },
    },
    {
        category: "admin",
        action: "role.permissions_updated",
        build: () => ({
            description: "Updated permissions of the Store Keeper role",
            subject: { type: "role", id: "role_store", label: "Store Keeper" },
            changes: [{ field: "permissions", label: "Permissions", from: "12 permissions", to: "14 permissions" }],
        }),
    },
    {
        category: "admin",
        action: "user.created",
        build: (pick) => {
            const user = pick(users.slice(1));
            return { description: `Created user account for ${user.name}`, subject: { type: "user", id: user.id, label: user.name } };
        },
    },
    {
        category: "asset",
        action: "asset.warranty_expiring",
        build: (pick) => {
            const asset = pick(assets);
            return { description: `Warranty for ${asset.label} expires in 30 days`, subject: asset, system: true };
        },
    },
];

const random = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
};

const TOTAL = 76;
const START = Date.UTC(2026, 10, 11, 9, 30);
const HOUR = 3_600_000;
const userAgents = ["Chrome 131 on Windows", "Edge 131 on Windows", "Safari on iPhone", "Firefox 132 on Ubuntu"];

const details: ActivityDetail[] = (() => {
    const next = random(42);
    const pick: Picker = (items) => items[Math.floor(next() * items.length)];
    let time = START;

    return Array.from({ length: TOTAL }, (_, index) => {
        const template = pick(templates);
        const built = template.build(pick);
        time -= Math.round((1 + next() * 9) * HOUR);
        const id = `act_${String(TOTAL - index).padStart(4, "0")}`;

        return {
            id,
            action: template.action,
            category: template.category,
            description: built.description,
            performedBy: built.system ? null : pick(users),
            subject: built.subject,
            site: pick(sites),
            occurredAt: new Date(time).toISOString(),
            changes: built.changes ?? [],
            related: built.related ?? [],
            note: built.note ?? null,
            context: {
                ip: built.system ? null : `103.4.${Math.floor(next() * 200)}.${Math.floor(next() * 250)}`,
                userAgent: built.system ? null : pick(userAgents),
                requestId: `req_${id}_${Math.floor(next() * 1e8).toString(36)}`,
            },
        };
    });
})();

const toRow = (activity: ActivityDetail): ActivityRow => activityRowSchema.parse(activity);

const includes = (value: string, term: string) => value.toLowerCase().includes(term.toLowerCase());

const mentions = (activity: ActivityDetail, type: Subject["type"], term: string) =>
    [activity.subject, ...activity.related].some((subject) => subject?.type === type && includes(subject.label, term));

export type HistoryQueryParams = Record<string, string | undefined>;

export function listActivities(query: HistoryQueryParams) {
    const filter = (key: string) => query[`filter[${key}]`];
    const page = Math.max(1, Number(query.page) || 1);
    const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));
    const dateFrom = filter("dateFrom");
    const dateTo = filter("dateTo");

    const matches = details.filter((activity) => {
        const day = activity.occurredAt.slice(0, 10);
        const search = query.search;
        return (
            (!search || [activity.description, activity.action, activity.subject?.label ?? ""].some((value) => includes(value, search))) &&
            (!filter("category") || activity.category === filter("category")) &&
            (!filter("performedBy") || activity.performedBy?.id === filter("performedBy")) &&
            (!filter("siteId") || activity.site?.id === filter("siteId")) &&
            (!filter("assetTag") || mentions(activity, "asset", filter("assetTag")!)) &&
            (!filter("employee") || mentions(activity, "employee", filter("employee")!)) &&
            (!dateFrom || day >= dateFrom) &&
            (!dateTo || day <= dateTo)
        );
    });

    const lastPage = Math.max(1, Math.ceil(matches.length / perPage));
    const items = matches.slice((page - 1) * perPage, page * perPage).map(toRow);

    return { items, pagination: { currentPage: page, lastPage, perPage, total: matches.length } };
}

export const findActivity = (id: string) => details.find((activity) => activity.id === id);

export const historyFilterOptions = () => ({
    users: users.map(({ id, name }) => ({ id, name })),
    sites,
});
