"use client"

import { AppSidebar } from "@/components/app-sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import Overview from "@/components/retell/Overview"

export default function RetellPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Retell Overview</h1>
            <Overview />
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
