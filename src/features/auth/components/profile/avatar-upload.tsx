import { useMutation } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { describeError, toAppError } from "@/lib/api/errors";
import { profileApi } from "../../api/auth.api";
import { useCurrentUser } from "../../hooks/use-current-user";
import { useAuthStore } from "../../store/auth.store";
import { UserAvatar } from "../user-avatar";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 2 * 1024 * 1024;

export function AvatarUpload() {
    const { t } = useTranslation("auth");
    const { user } = useCurrentUser();
    const setMe = useAuthStore((state) => state.setMe);
    const input = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const clearPreview = () =>
        setPreview((current) => {
            if (current) URL.revokeObjectURL(current);
            return null;
        });

    const upload = useMutation({
        mutationFn: profileApi.uploadAvatar,
        onSuccess: ({ avatarUrl }) => {
            setMe((me) => ({ ...me, user: { ...me.user, avatarUrl } }));
            toast.success(t("messages.photoSaved"));
        },
        onError: (error) => toast.error(describeError(toAppError(error))),
        onSettled: clearPreview,
    });

    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
            toast.error(t("messages.photoInvalid"));
            return;
        }
        setPreview(URL.createObjectURL(file));
        upload.mutate(file);
    };

    return (
        <div className="flex items-center gap-4">
            <UserAvatar user={user} src={preview} className="size-16" />
            <input ref={input} type="file" accept={ACCEPTED_TYPES.join(",")} className="hidden" onChange={onFileChange} />
            <Button type="button" variant="outline" disabled={upload.isPending} onClick={() => input.current?.click()}>
                <Camera className="size-4" />
                {t("actions.changePhoto")}
            </Button>
        </div>
    );
}
