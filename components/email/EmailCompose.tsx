"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export function EmailCompose({ onClose }: { onClose: () => void }) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const handleSend = () => {
    // Implement email sending logic here
    console.log("Sending email:", { to, subject, body })
    // Reset form and close compose view
    setTo("")
    setSubject("")
    setBody("")
    onClose()
  }

  return (
    <div className="bg-background p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">New Message</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Compose your email..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
