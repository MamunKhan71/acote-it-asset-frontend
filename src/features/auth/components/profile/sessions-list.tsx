import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Monitor } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { describeError, toAppError } from "@/lib/api/errors";
import { formatDateTime } from "@/lib/format";
import { authKeys, profileApi } from "../../api/auth.api";
import { signOutEverywhere } from "../../lib/session";

export function SessionsList() {
    const { t } = useTranslation("auth");
    const queryClient = useQueryClient();
    const sessions = useQuery({ queryKey: authKeys.sessions, queryFn: profileApi.sessions });
    const refresh = () => queryClient.invalidateQueries({ queryKey: authKeys.sessions });
    const notifyError = (error: unknown) => toast.error(describeError(toAppError(error)));

    const revoke = useMutation({
        mutationFn: profileApi.revokeSession,
        onSuccess: () => toast.success(t("messages.sessionRevoked")),
        onError: notifyError,
        onSettled: refresh,
    });

    const revokeAll = useMutation({ mutationFn: signOutEverywhere, onError: notifyError });

    if (sessions.isPending) return <Skeleton className="h-32 w-full" />;

    return (
        <div className="space-y-4">
            <ul className="divide-y rounded-md border">
                {sessions.data?.map((session) => (
                    <li key={session.id} className="flex items-center gap-3 p-4">
                        <Monitor className="size-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 truncate text-sm font-medium">
                                {session.device}
                                {session.isCurrent && <Badge variant="secondary">{t("messages.currentDevice")}</Badge>}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {session.ip} · {t("messages.lastUsed", { time: formatDateTime(session.lastUsedAt) })}
                            </p>
                        </div>
                        {!session.isCurrent && (
                            <Button variant="outline" size="sm" disabled={revoke.isPending} onClick={() => revoke.mutate(session.id)}>
                                {t("actions.signOutDevice")}
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
            <Button variant="destructive" disabled={revokeAll.isPending} onClick={() => revokeAll.mutate()}>
                {t("actions.signOutEverywhere")}
            </Button>
        </div>
    );
}
