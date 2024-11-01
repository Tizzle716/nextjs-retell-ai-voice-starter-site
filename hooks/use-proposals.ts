import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from '@/utils/supabase/client'
import { Proposal } from "@/app/types/proposal"
import { toast } from "@/hooks/use-toast"

// Types
interface ProposalFormValues {
  contact_id: string
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
  }>
  tax: number
  deadline: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
}

// Helpers
const buildProposalQuery = (filters: any) => {
  const supabase = createClient()
  let query = supabase
    .from("client_proposals")
    .select("*, contact:contacts(*)")

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status)
  }

  if (filters?.dateRange && filters.dateRange !== "all") {
    const date = new Date()
    switch (filters.dateRange) {
      case "today":
        date.setHours(0, 0, 0, 0)
        query = query.gte("created_at", date.toISOString())
        break
      case "week":
        date.setDate(date.getDate() - 7)
        query = query.gte("created_at", date.toISOString())
        break
      case "month":
        date.setMonth(date.getMonth() - 1)
        query = query.gte("created_at", date.toISOString())
        break
    }
  }

  return query.order("created_at", { ascending: false })
}

const handleError = (error: any) => {
  console.error("Operation failed:", error)
  toast({
    variant: "destructive",
    title: "Erreur",
    description: "Une erreur est survenue"
  })
}

export function useProposals() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
  })

  // Fetch proposals
  const {
    data: proposals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["proposals", filters],
    queryFn: async () => {
      const query = buildProposalQuery(filters)
      const { data, error } = await query
      
      if (error) throw error
      return data as Proposal[]
    },
  })

  // Create proposal
  const createProposal = useMutation({
    mutationFn: async (values: ProposalFormValues) => {
      const { data, error } = await supabase
        .from("client_proposals")
        .insert([values])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
      toast({
        title: "Succès",
        description: "Devis créé avec succès"
      })
    },
    onError: handleError
  })

  // Update proposal
  const updateProposal = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<ProposalFormValues> }) => {
      const { data, error } = await supabase
        .from("client_proposals")
        .update(values)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
      toast({
        title: "Succès",
        description: "Devis mis à jour avec succès"
      })
    },
    onError: handleError
  })

  // Duplicate proposal
  const duplicateProposal = useMutation({
    mutationFn: async (proposal: Proposal) => {
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

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
      toast({
        title: "Succès",
        description: "Devis dupliqué avec succès"
      })
    },
    onError: (error) => {
      console.error("Duplication failed:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la duplication du devis"
      })
    }
  })

  // Delete proposal
  const deleteProposal = useMutation({
    mutationFn: async (proposal: Proposal) => {
      const { error } = await supabase
        .from("client_proposals")
        .delete()
        .eq("id", proposal.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
      toast({
        title: "Succès",
        description: "Devis supprimé avec succès"
      })
    },
    onError: (error) => {
      console.error("Deletion failed:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la suppression du devis"
      })
    }
  })

  return {
    proposals,
    isLoading,
    error,
    filters,
    setFilters,
    duplicateProposal: duplicateProposal.mutate,
    deleteProposal: deleteProposal.mutate,
    createProposal: createProposal.mutate,
    updateProposal: updateProposal.mutate,
    isDuplicating: duplicateProposal.isPending,
    isDeleting: deleteProposal.isPending
  }
} 