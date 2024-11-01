import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Interaction } from '@/app/types/interaction'

interface UseInteractionsReturn {
  interactions: Interaction[]
  isLoading: boolean
  error: Error | null
  addInteraction: (interaction: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  deleteInteraction: (id: string) => Promise<void>
}

export function useInteractions(contactId: string): UseInteractionsReturn {
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClient()

  const fetchInteractions = async () => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('interactions')
        .select('*')
        .eq('contact_id', contactId)
        .order('date', { ascending: false })

      if (supabaseError) throw supabaseError
      setInteractions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch interactions'))
    } finally {
      setIsLoading(false)
    }
  }

  const addInteraction = async (interaction: Omit<Interaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error: supabaseError } = await supabase
        .from('interactions')
        .insert([{
          ...interaction,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (supabaseError) throw supabaseError
      await fetchInteractions()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add interaction')
    }
  }

  const deleteInteraction = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('interactions')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError
      await fetchInteractions()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete interaction')
    }
  }

  useEffect(() => {
    fetchInteractions()
  }, [contactId])

  return {
    interactions,
    isLoading,
    error,
    addInteraction,
    deleteInteraction
  }
}