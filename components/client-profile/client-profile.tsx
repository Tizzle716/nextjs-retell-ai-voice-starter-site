'use client'

import { useState } from "react"
import { useClientProfile } from "@/hooks/use-client-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ErrorHandler } from "@/components/error-handler"
import { ClientOverviewTab } from "./tabs/overview-tab"
import { ClientInteractionsTab } from "./tabs/interactions-tab"
import { ClientSalesTab } from "./tabs/sales-tab"
import { ClientDocumentsTab } from "./tabs/documents-tab"
import { ClientAITab } from "./tabs/ai-tab"
import { ClientHeader } from "./client-header"
import { EditProfileDialog } from "./edit-profile-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { ClientProfile } from "@/app/types/client-profile"

export function ClientProfileComponent({ clientId }: { clientId: string }) {
  const { client, isLoading, isError, mutate } = useClientProfile(clientId)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleEditSubmit = async (updatedData: ClientProfile) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update client')
      }

      await mutate()
      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      })
    } catch (error) {
      console.error('Error updating client:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorHandler error={isError} />
  }

  if (!client) {
    return <div>Client non trouvé</div>
  }

  return (
    <div className="space-y-6">
      <ClientHeader 
        client={client} 
        onEdit={() => setIsEditDialogOpen(true)} 
      />
      
      <EditProfileDialog
        client={client}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
      />
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai">IA</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <ClientOverviewTab client={client} />
        </TabsContent>
        <TabsContent value="interactions">
          <ClientInteractionsTab clientId={clientId} />
        </TabsContent>
        <TabsContent value="sales">
          <ClientSalesTab clientId={clientId} />
        </TabsContent>
        <TabsContent value="documents">
          <ClientDocumentsTab clientId={clientId} />
        </TabsContent>
        <TabsContent value="ai">
          <ClientAITab />
        </TabsContent>
      </Tabs>
    </div>
  )
} 