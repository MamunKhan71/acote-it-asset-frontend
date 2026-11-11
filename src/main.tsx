import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/app";
import { env } from "@/config/env";
import { initTheme } from "@/lib/theme";

async function start() {
    if (import.meta.env.DEV && env.VITE_API_MOCK) {
        const { enableMockApi } = await import("@/mocks");
        enableMockApi();
    }

    initTheme();

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}

void start();
