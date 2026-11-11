import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { profileApi } from "../api/auth.api";
import { applyPreferences } from "../lib/session";
import { useAuthStore } from "../store/auth.store";
import type { Preferences } from "../types";

export function useUpdatePreferences() {
    const { t } = useTranslation("auth");
    const setMe = useAuthStore((state) => state.setMe);

    const apply = (next: Preferences) => {
        setMe((me) => ({ ...me, preferences: next }));
        applyPreferences(next);
    };

    return useMutation({
        mutationFn: (patch: Partial<Preferences>) => profileApi.update({ preferences: patch }),
        onMutate: (patch) => {
            const previous = useAuthStore.getState().me!.preferences;
            apply({ ...previous, ...patch });
            return { previous };
        },
        onSuccess: setMe,
        onError: (_error, _patch, context) => {
            if (context) apply(context.previous);
            toast.error(t("messages.preferencesFailed"));
        },
    });
}
