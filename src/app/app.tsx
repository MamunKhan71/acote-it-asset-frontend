import { RouterProvider } from "react-router-dom";
import { AuthBootstrap } from "./auth-bootstrap";
import { AppProviders } from "./providers";
import { router } from "./router";

export function App() {
    return (
        <AppProviders>
            <AuthBootstrap>
                <RouterProvider router={router} />
            </AuthBootstrap>
        </AppProviders>
    );
}
