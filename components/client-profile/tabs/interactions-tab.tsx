import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useClientInteractions } from "@/hooks/use-client-interactions"
import { formatters } from '@/app/types/client-profile'

export function ClientInteractionsTab({ clientId }: { clientId: string }) {
  const { interactions, isLoading } = useClientInteractions(clientId)

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des interactions</CardTitle>
        <CardDescription>Récapitulatif des dernières interactions avec le client</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interactions?.map((interaction) => (
              <TableRow key={interaction.date}>
                <TableCell>
                  <Badge variant={
                    interaction.type === "Appel Entrant" ? "default" :
                    interaction.type === "Appel Sortant" ? "secondary" : "outline"
                  }>
                    {interaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{formatters.formatDate(interaction.date)}</TableCell>
                <TableCell>{interaction.duration || '-'} min</TableCell>
                <TableCell>{interaction.score || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">Terminé</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 