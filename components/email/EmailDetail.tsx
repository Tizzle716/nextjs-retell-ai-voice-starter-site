// components/email/EmailDetail.tsx
import { Button } from "@/components/ui/button"
import { ArrowLeft, Reply, Trash } from "lucide-react"
import { EmailSummary } from "./EmailSummary"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Email } from "@/app/types/email"

interface EmailDetailProps {
  email: Email
  onBack: () => void
}

export function EmailDetail({ email, onBack }: EmailDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{email.subject}</h2>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback>{email.from[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{email.from}</p>
            <p className="text-sm text-muted-foreground">{new Date(email.date).toLocaleString()}</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="prose max-w-none">
        <EmailSummary emailContent={email.body || email.preview} />
        <p>{email.body || email.preview}</p>
      </div>
    </div>
  )
}
