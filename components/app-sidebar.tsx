"use client"

import * as React from "react"
import {
  BookCheck,
  Command,
  Speech,
  LifeBuoy,
  NotebookPen,
  Dumbbell,
  Send,
  CheckCheck,
  House,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Bible Tracker",
      url: "/dashboard/bible-tracker",
      icon: BookCheck,
    },
    {
      title: "Prayer Log",
      url: "/dashboard/prayer-log",
      icon: Speech,
    },
    {
      title: "Journal",
      url: "/dashboard/journal",
      icon: NotebookPen,
    },
    {
      title: "Goals",
      url: "/dashboard/goals",
      icon: CheckCheck,
    },
    {
      title: "Fitness",
      url: "/dashboard/fitness",
      icon: Dumbbell,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Faith & Growth Tracker</span>
                  <span className="truncate text-xs"></span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
