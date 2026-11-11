import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { applyFieldErrors, toAppError, type AppError } from "@/lib/api/errors";

type SubmitOptions<TValues, TResult> = {
    onSuccess?: (result: TResult, values: TValues) => void;
    onError?: (error: AppError, values: TValues) => void;
};

export function useFormSubmit<TInput extends FieldValues, TValues extends FieldValues, TResult>(
    form: UseFormReturn<TInput, unknown, TValues>,
    action: (values: TValues) => Promise<TResult>,
    { onSuccess, onError }: SubmitOptions<TValues, TResult> = {},
) {
    const [error, setError] = useState<AppError | null>(null);
    const { mutateAsync, isPending } = useMutation({ mutationFn: action });

    const submit = form.handleSubmit(async (values) => {
        setError(null);
        try {
            onSuccess?.(await mutateAsync(values), values);
        } catch (cause) {
            const appError = toAppError(cause);
            onError?.(appError, values);
            if (!applyFieldErrors(appError, form.setError)) setError(appError);
        }
    });

    return { submit, error, isPending, clearError: () => setError(null) };
}
