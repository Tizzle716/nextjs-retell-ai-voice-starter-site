import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { formatters } from '@/app/types/client-profile'
import { useState, useEffect } from 'react'

// Définir l'interface pour une proposition
interface Proposal {
  id: string
  product: string
  amount: number
  status: string
  date: string
}

interface Campaign {
  id: string
  name: string
  type: string
  status: string
  endDate: string
}

// Hook personnalisé pour charger les données
function useClientSales(clientId: string) {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    // Fonction pour charger les propositions
    const loadProposals = async () => {
      try {
        // Remplacer par votre appel API réel
        const response = await fetch(`/api/clients/${clientId}/proposals`)
        const data = await response.json()
        setProposals(data)
      } catch (error) {
        console.error('Failed to load proposals:', error)
      }
    }

    // Fonction pour charger les campagnes
    const loadCampaigns = async () => {
      try {
        // Remplacer par votre appel API réel
        const response = await fetch(`/api/clients/${clientId}/campaigns`)
        const data = await response.json()
        setCampaigns(data)
      } catch (error) {
        console.error('Failed to load campaigns:', error)
      }
    }

    loadProposals()
    loadCampaigns()
  }, [clientId])

  return { proposals, campaigns }
}

export function ClientSalesTab({ clientId }: { clientId: string }) {
  const { proposals, campaigns } = useClientSales(clientId)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Propositions commerciales</CardTitle>
            <CardDescription>Historique des propositions envoyées</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle proposition
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.product}</TableCell>
                  <TableCell>{formatters.formatCurrency(proposal.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.status}</Badge>
                  </TableCell>
                  <TableCell>{proposal.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campagnes actives</CardTitle>
          <CardDescription>Campagnes marketing en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 