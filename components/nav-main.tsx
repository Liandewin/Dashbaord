"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-widest text-[var(--text-faint)] mb-2">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <Collapsible key={item.title} asChild defaultOpen={isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`
                    text-base font-medium transition-all duration-200 rounded-lg px-3 py-2
                    ${isActive
                      ? 'text-[var(--app-gold)] bg-[var(--gold-bg-subtle)] border border-[var(--gold-border-faint)]'
                      : 'text-[var(--text-soft)] hover:text-[var(--app-text)] hover:bg-[var(--card-bg-hover)]'
                    }
                  `}
                >
                  <Link href={item.url}>
                    <item.icon className={isActive ? 'text-[var(--app-gold)]' : ''} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90 text-[var(--text-faint)] hover:text-[var(--text-soft)]">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={`
                                  text-sm transition-all duration-200
                                  ${isSubActive
                                    ? 'text-[var(--app-gold)]'
                                    : 'text-[var(--text-faint)] hover:text-[var(--text-soft)]'
                                  }
                                `}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}