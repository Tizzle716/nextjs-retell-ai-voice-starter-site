// components/app-sidebar/app-sidebar-wrapper.tsx
"use client"

import { User } from '@supabase/supabase-js'
import { AppSidebar } from "./app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface AppSidebarWrapperProps {
  user: User | null
  userMetadata?: {
    avatar_url?: string
    full_name?: string
  }
}

export function AppSidebarWrapper({ user, userMetadata }: AppSidebarWrapperProps) {
  return (
    <>
      <AppSidebar user={user} userMetadata={userMetadata} />
      <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
    </>
  )
}
