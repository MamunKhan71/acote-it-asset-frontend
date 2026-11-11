import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { describeError, toAppError } from "./api/errors";

const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            const appError = toAppError(error);
            if (appError.isUnexpected) toast.error(describeError(appError));
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => failureCount < MAX_RETRIES && toAppError(error).isUnexpected,
        },
        mutations: {
            retry: false,
        },
    },
});
