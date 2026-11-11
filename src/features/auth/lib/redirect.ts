import { paths } from "@/config/paths";

export const safeRedirect = (target: string | null) =>
    target?.startsWith("/") && !target.startsWith("//") ? target : paths.dashboard;
