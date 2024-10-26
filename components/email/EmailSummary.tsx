// components/email/EmailSummary.tsx
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface EmailSummaryProps {
  emailContent: string
}

export function EmailSummary({ emailContent }: EmailSummaryProps) {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating AI summarization
    const generateSummary = async () => {
      setLoading(true)
      // Replace this with actual AI summarization logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSummary("This is an AI-generated summary of the email content.")
      setLoading(false)
    }

    generateSummary()
  }, [emailContent])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-accent p-4 rounded-lg">
      <h3 className="font-semibold mb-2">AI Summary</h3>
      <p>{summary}</p>
    </div>
  )
}