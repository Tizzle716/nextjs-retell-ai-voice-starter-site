
import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { AppSidebarWrapper } from "@/components/app-sidebar/app-sidebar-wrapper"
import { redirect } from 'next/navigation'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const userMetadata = {
    avatar_url: user.user_metadata?.avatar_url,
    full_name: user.user_metadata?.full_name
  }

  return (
    <SidebarProvider>
      <AppSidebarWrapper user={user} userMetadata={userMetadata} />
      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-10 bg-white border-b p-4 flex items-center">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
