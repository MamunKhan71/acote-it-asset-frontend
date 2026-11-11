import "@/lib/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { store } from "@/lib/store";

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster richColors position="top-right" />
            </QueryClientProvider>
        </Provider>
    );
}
