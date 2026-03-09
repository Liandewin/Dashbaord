"use client"

import { LogOut } from "lucide-react"
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavUser() {
  const supabase = createSupabaseBrowserClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-white/50 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </button>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}