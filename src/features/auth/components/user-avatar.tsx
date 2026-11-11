import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AuthUser } from "../types";

type UserAvatarProps = {
    user: Pick<AuthUser, "name" | "avatarUrl">;
    src?: string | null;
    className?: string;
};

export function UserAvatar({ user, src, className }: UserAvatarProps) {
    return (
        <Avatar className={cn("size-9 rounded-md", className)}>
            <AvatarImage src={src ?? user.avatarUrl ?? undefined} alt={user.name} className="object-cover" />
            <AvatarFallback className="rounded-md bg-primary/10 text-xs font-semibold text-primary">{initials(user.name)}</AvatarFallback>
        </Avatar>
    );
}
