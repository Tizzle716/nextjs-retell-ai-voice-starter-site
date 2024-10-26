"use client"

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Email } from '@/app/types/email'

export function EmailContent({ emails, onSelectEmail }: { emails: Email[], onSelectEmail: (email: Email) => void }) {
  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <div
          key={email.id}
          className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent cursor-pointer"
          onClick={() => onSelectEmail(email)}
        >
          <Avatar>
            <AvatarFallback>{email.from[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{email.from}</p>
            <h4 className="text-base font-semibold truncate">{email.subject}</h4>
            <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(email.date), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}
