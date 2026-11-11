import i18n from "@/lib/i18n";

export const formatDateTime = (value: string, timeStyle: "short" | "medium" = "short") =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle }).format(new Date(value));

export const formatTime = (value: string) => new Intl.DateTimeFormat(i18n.language, { timeStyle: "short" }).format(new Date(value));

export const initials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
