"use client"

import { useState, useEffect } from "react"
import { EmailSidebar } from "./EmailSidebar"
import { EmailContent } from "./EmailContent"
import { EmailCompose } from "./EmailCompose"
import { EmailDetail } from "./EmailDetail"
import { UserMenu } from "./UserMenu"
import type { Email } from '@/app/types/email'

// Ajout des emails de démonstration
const dummyEmails: Email[] = [
  { 
    id: "1", 
    from: "john@example.com", 
    subject: "Meeting tomorrow", 
    date: "2023-04-15", 
    preview: "This is a preview of the email content.",
    body: "This is the full body of the email content." 
  },
  { 
    id: "2", 
    from: "jane@example.com", 
    subject: "Project update", 
    date: "2023-04-14", 
    preview: "This is another preview of the email content.",
    body: "This is the full body of another email content." 
  },
  // Ajoutez d'autres emails de démonstration si nécessaire
]

export function EmailDashboard() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    // Simulons le chargement des emails
    setEmails(dummyEmails)
  }, [])

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email)
    setIsComposing(false)
  }

  const handleCompose = () => {
    setIsComposing(true)
    setSelectedEmail(null)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <EmailSidebar onCompose={handleCompose} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-2xl font-bold">Email Dashboard</h1>
          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto p-4">
          {isComposing ? (
            <EmailCompose onClose={() => setIsComposing(false)} />
          ) : selectedEmail ? (
            <EmailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />
          ) : (
            <EmailContent emails={emails} onSelectEmail={handleSelectEmail} />
          )}
        </main>
      </div>
    </div>
  )
}
