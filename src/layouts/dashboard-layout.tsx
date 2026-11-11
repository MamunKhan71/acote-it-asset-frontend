import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { paths } from "@/config/paths";
import { ThemeToggle } from "@/features/auth";
import { usePageTitle } from "@/hooks/use-route-handle";
import { AppSidebar } from "./app-sidebar";

export function DashboardLayout() {
    const { t } = useTranslation();
    const { title } = usePageTitle();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link to={paths.dashboard}>{t("app.name")}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
