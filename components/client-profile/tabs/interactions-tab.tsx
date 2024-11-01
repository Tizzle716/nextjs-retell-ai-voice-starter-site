import { useInteractions } from "@/hooks/use-interactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Info } from "lucide-react"
import { formatters } from '@/app/types/client-profile'
import { AddInteractionDialog } from "@/components/client-profile/dialogs/add-interaction-dialog"
import { useState } from "react"
import { Interaction } from "@/app/types/interaction"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const formatMetadata = (metadata: Record<string, unknown> | undefined) => {
  if (!metadata) return []
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value)
  }))
}

export function ClientInteractionsTab({ clientId }: { clientId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { interactions, isLoading, error, addInteraction } = useInteractions(clientId)

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>
  }

  const handleAddInteraction = async (data: Partial<Interaction>) => {
    try {
      await addInteraction({
        contact_id: clientId,
        type: data.type!,
        date: new Date().toISOString(),
        duration: data.duration,
        score: data.score
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error adding interaction:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Historique des interactions</CardTitle>
          <CardDescription>Récapitulatif des dernières interactions avec le client</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle interaction
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions.map((interaction) => (
              <TableRow key={interaction.id}>
                <TableCell>
                  <Badge variant={
                    interaction.type === "Appel Entrant" ? "default" :
                    interaction.type === "Appel Sortant" ? "secondary" : "outline"
                  }>
                    {interaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{formatters.formatDate(interaction.date)}</TableCell>
                <TableCell>{interaction.duration ? `${interaction.duration} min` : '-'}</TableCell>
                <TableCell>{interaction.score || '-'}</TableCell>
                <TableCell>
                  {interaction.metadata ? (
                    <div className="flex flex-wrap gap-1">
                      {formatMetadata(interaction.metadata).map(({ key, value }, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge 
                                variant="secondary" 
                                className="cursor-help flex items-center gap-1"
                              >
                                <span className="font-medium">{key}</span>
                                <Info className="h-3 w-3" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs break-words">
                                {value}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Terminé</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AddInteractionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddInteraction}
      />
    </Card>
  )
} 