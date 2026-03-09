import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 w-full bg-[#0a0a0f]">
                <div className="bg-[#0a0a0f] px-4 py-2">
                    <SidebarTrigger className="text-white/40 hover:text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)] transition-all duration-200" />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}