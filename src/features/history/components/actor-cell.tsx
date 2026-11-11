import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import type { Actor } from "../schemas/history.schema";

export function ActorCell({ actor }: { actor: Actor | null }) {
    const { t } = useTranslation("history");

    return (
        <div className="flex items-center gap-2.5">
            <Avatar className="size-7 rounded-md">
                {actor?.avatarUrl && <AvatarImage src={actor.avatarUrl} alt={actor.name} />}
                <AvatarFallback className="rounded-md bg-primary/10 text-[11px] font-semibold text-primary">
                    {actor ? initials(actor.name) : <Bot className="size-3.5" />}
                </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm">{actor?.name ?? t("system")}</span>
        </div>
    );
}
