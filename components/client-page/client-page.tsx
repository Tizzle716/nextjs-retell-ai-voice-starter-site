'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Mail, MapPin, FileText } from 'lucide-react'

// Mock data (replace with actual data fetching logic)
const clientData = {
  id: 1,
  name: "John Doe",
  company: "Acme Corp",
  status: "Client",
  leadScore: 85,
  segment: "B2B",
  tags: ["Grand Compte", "Tech"],
  lastInteraction: "2023-04-15",
  phone: "+33123456789",
  email: "john.doe@acme.com",
  preferredContact: "Email",
  address: "123 Rue de la Paix, 75001 Paris",
}

const interactions = [
  { id: 1, type: "Appel", date: "2023-04-15", content: "Discussion sur le nouveau produit", status: "Terminé" },
  { id: 2, type: "Email", date: "2023-04-10", content: "Envoi de la proposition commerciale", status: "Lu" },
]

const campaigns = [
  { id: 1, name: "Campagne Printemps 2023", type: "Email", status: "Active" },
  { id: 2, name: "Webinaire Tech", type: "Événement", status: "À venir" },
]

const proposals = [
  { id: 1, product: "Solution CRM", amount: "5000€", status: "Envoyée", date: "2023-04-01" },
  { id: 2, product: "Module IA", amount: "2500€", status: "En négociation", date: "2023-04-10" },
]

export function ClientPageComponent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={clientData.name} />
            <AvatarFallback>{clientData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{clientData.name}</h1>
            <p className="text-xl text-muted-foreground">{clientData.company}</p>
            <div className="flex space-x-2 mt-2">
              <Badge>{clientData.status}</Badge>
              <Badge variant="outline">Score: {clientData.leadScore}</Badge>
              <Badge variant="secondary">{clientData.segment}</Badge>
            </div>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline"><Phone className="mr-2 h-4 w-4" /> Appeler</Button>
          <Button><Mail className="mr-2 h-4 w-4" /> Envoyer un email</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coordonnées</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientData.phone}</div>
                <p className="text-xs text-muted-foreground">
                  Préférence: {clientData.preferredContact}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientData.email}</div>
                <p className="text-xs text-muted-foreground">
                  Dernière interaction: {clientData.lastInteraction}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adresse</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Paris</div>
                <p className="text-xs text-muted-foreground">{clientData.address}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tags</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {clientData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions">
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
                    <TableHead>Contenu</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>{interaction.type}</TableCell>
                      <TableCell>{interaction.date}</TableCell>
                      <TableCell>{interaction.content}</TableCell>
                      <TableCell>{interaction.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campagnes actives</CardTitle>
                <CardDescription>Campagnes marketing en cours pour ce client</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.type}</TableCell>
                        <TableCell>{campaign.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Propositions commerciales</CardTitle>
                <CardDescription>Historique des propositions envoyées au client</CardDescription>
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
                        <TableCell>{proposal.amount}</TableCell>
                        <TableCell>{proposal.status}</TableCell>
                        <TableCell>{proposal.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents partagés</CardTitle>
              <CardDescription>Accès aux documents liés au client</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Liste des documents à implémenter</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>Interactions avec Agent AI</CardTitle>
              <CardDescription>Historique et paramètres des interactions IA</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Historique des interactions IA à implémenter</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
