import { createClient } from '@/utils/supabase/client'
import { Proposal } from "@/app/types/proposal"
import { toast } from "@/hooks/use-toast"

export async function duplicateProposal(proposal: Proposal) {
  const supabase = createClient()
  
  // Créer une copie du devis
  const newProposal = {
    ...proposal,
    id: undefined,
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("client_proposals")
    .insert([newProposal])
    .select()
    .single()

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Erreur lors de la duplication du devis"
    })
    throw error
  }

  toast({
    title: "Succès",
    description: "Devis dupliqué avec succès"
  })
  return data
}

export async function deleteProposal(proposal: Proposal) {
  const supabase = createClient()

  const { error } = await supabase
    .from("client_proposals")
    .delete()
    .eq("id", proposal.id)

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Erreur lors de la suppression du devis"
    })
    throw error
  }

  toast({
    title: "Succès",
    description: "Devis supprimé avec succès"
  })
}

export async function updateProposalStatus(
  proposalId: string,
  status: Proposal["status"]
) {
  const supabase = createClient()

  const { error } = await supabase
    .from("client_proposals")
    .update({ status })
    .eq("id", proposalId)

  if (error) {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Erreur lors de la mise à jour du statut"
    })
    throw error
  }

  toast({
    title: "Succès",
    description: "Statut mis à jour avec succès"
  })
} 