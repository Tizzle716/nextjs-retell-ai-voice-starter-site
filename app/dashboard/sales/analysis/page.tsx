"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Proposal } from "@/app/types/sales"
import { ColumnDef } from "@tanstack/react-table"
import { useProposals } from "@/hooks/use-proposals"

const columns: ColumnDef<Proposal>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "client", header: "Client" },
  { accessorKey: "date", header: "Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={
        row.original.status === 'accepted' ? "success" : 
        row.original.status === 'rejected' ? "destructive" : 
        row.original.status === 'sent' ? "warning" : 
        "secondary"
      }>
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => (
      <Badge variant={row.original.score >= 70 ? "success" : "warning"}>
        {row.original.score}
      </Badge>
    ),
  },
]

export default function AnalysisPage() {
  const { data: proposals, isLoading, error } = useProposals()
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    // Logic to display proposal details
    console.log("Viewing proposal:", proposal)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Proposal Analysis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Proposal Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={proposals}
            columns={columns}
            onView={handleView}
          />
        </CardContent>
      </Card>
      {selectedProposal && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Selected Proposal Details</h2>
          <pre>{JSON.stringify(selectedProposal, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
