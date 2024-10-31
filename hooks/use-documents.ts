import useSWR from 'swr'
import { Document } from '@/app/types/document'
import { createClient } from '@/utils/supabase/client'

export function useDocuments() {
  const supabase = createClient()

  // Données mockées pour le développement
  const mockDocuments: Document[] = [
    {
      id: '1',
      title: 'Guide Construction Maison',
      content: 'Contenu du guide de construction...',
      category: 'Construction',
      subcategory: 'Maison individuelle',
      file_type: 'PDF',
      keywords: ['construction', 'maison', 'guide'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Rénovation Énergétique',
      content: 'Guide de rénovation énergétique...',
      category: 'Energies',
      subcategory: 'Rénovation',
      file_type: 'PDF',
      keywords: ['rénovation', 'énergie', 'isolation'],
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  return {
    data: mockDocuments,
    isLoading: false,
    error: null,
    mutate: async () => { /* à implémenter plus tard */ }
  }
}