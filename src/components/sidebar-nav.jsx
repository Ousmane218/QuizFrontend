import * as React from "react"
import { Home, ListChecks, PlusCircle, Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "My Scores",
    url: "#",
    icon: ListChecks,
  },
  {
    title: "Create Quiz",
    url: "#",
    icon: PlusCircle,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function DashboardSidebar({ user, onNavigate, activeTab }) {
  const { setOpenMobile, isMobile } = useSidebar()

  const handleNavigate = (tab) => {
    onNavigate(tab)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 font-bold">Q</div>
          <h2 className="text-xl font-bold tracking-tight">QuizApp</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={activeTab === item.title.toLowerCase()}
                onClick={() => handleNavigate(item.title.toLowerCase())}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{user?.username || "Guest User"}</span>
            <span className="text-xs truncate max-w-[120px]">{user?.email || "Logged in"}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
