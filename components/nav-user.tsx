"use client"

import { LogOut } from "lucide-react"
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

export function NavUser() {
  const supabase = createSupabaseBrowserClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout} className="hover:text-red-400 hover:bg-red-400/10">
          <LogOut />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}