"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ProposalPage() {
  const [proposalText, setProposalText] = useState("")
  const { toast } = useToast()

  const handleSaveProposal = () => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder la proposition
    toast({
      title: "Proposal saved",
      description: "Your proposal has been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Proposal</h1>
      <Card>
        <CardHeader>
          <CardTitle>Proposal Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            placeholder="Enter your proposal details here..."
            className="min-h-[200px] mb-4"
          />
          <Button onClick={handleSaveProposal}>
            Save Proposal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
