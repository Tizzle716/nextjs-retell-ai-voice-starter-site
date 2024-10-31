import { UseClientInteractionsReturn, InteractionType } from '@/app/types/client-profile'
import { createClient } from '@/utils/supabase/client'

export function useClientInteractions(clientId: string): UseClientInteractionsReturn {
  const supabase = createClient()

  // Données mockées pour le développement
  const mockInteractions = [
    {
      type: "Appel Sortant" as InteractionType,
      date: new Date().toISOString(),
      duration: 300, // 5 minutes
      score: 85
    },
    {
      type: "Email Entrant" as InteractionType,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // hier
      score: 65
    }
  ]

  return {
    interactions: mockInteractions,
    isLoading: false,
    error: null
  }
} 