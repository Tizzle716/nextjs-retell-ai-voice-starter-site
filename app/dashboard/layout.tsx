import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { AppSidebarWrapper } from "@/components/app-sidebar/app-sidebar-wrapper"
import { redirect } from 'next/navigation'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { Home } from "lucide-react"
import Link from "next/link"

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

  const userMetadata = user.user_metadata;

  return (
    <SidebarProvider>
      <AppSidebarWrapper user={user} userMetadata={userMetadata} />
      <SidebarInset className="min-h-screen">
        <header className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          </div>
          <ThemeSwitcher />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
