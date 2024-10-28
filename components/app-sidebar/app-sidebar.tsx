"use client"

import * as React from "react"
import { User } from '@supabase/supabase-js'

import { NavMain } from "@/components/app-sidebar/nav-main"
import { NavUser } from "@/components/app-sidebar/nav-user"
import { TeamSwitcher } from "@/components/app-sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Move the data object to a separate file, e.g., app-sidebar-data.ts
import { sidebarData } from "./app-sidebar-data"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User | null;
  userMetadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

export function AppSidebar({ user, userMetadata, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} userMetadata={userMetadata} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
