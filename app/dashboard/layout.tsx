import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full bg-background">
                <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-2 flex items-center justify-between">
                    <SidebarTrigger className="text-[var(--text-faint)] hover:text-[var(--app-gold)] hover:bg-[var(--gold-bg-subtle)] transition-all duration-200" />
                    <ThemeToggle />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}