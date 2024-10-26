"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Inbox, Send, Archive, Trash } from "lucide-react"
import { useState } from "react"
import type { LucideIcon } from 'lucide-react'

interface SidebarButtonProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={cn("w-full justify-start", isActive && "bg-accent")}
    onClick={onClick}
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
)

interface EmailSidebarProps {
  onCompose: () => void
}

export function EmailSidebar({ onCompose }: EmailSidebarProps) {
  const [activeSection, setActiveSection] = useState("Inbox")

  return (
    <div className="w-64 bg-background border-r h-full p-4 flex flex-col">
      <Button className="w-full mb-4" variant="default" onClick={onCompose}>
        Compose
      </Button>
      <nav className="space-y-2">
        <SidebarButton icon={Inbox} label="Inbox" isActive={activeSection === "Inbox"} onClick={() => setActiveSection("Inbox")} />
        <SidebarButton icon={Send} label="Sent" isActive={activeSection === "Sent"} onClick={() => setActiveSection("Sent")} />
        <SidebarButton icon={Archive} label="Archive" isActive={activeSection === "Archive"} onClick={() => setActiveSection("Archive")} />
        <SidebarButton icon={Trash} label="Trash" isActive={activeSection === "Trash"} onClick={() => setActiveSection("Trash")} />
      </nav>
    </div>
  )
}
