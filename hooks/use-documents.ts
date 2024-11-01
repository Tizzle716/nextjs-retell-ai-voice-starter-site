import { createClient } from '@/utils/supabase/client'
import { Document, DocumentWithVector } from '@/app/types/document'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useDocuments() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const fetchDocuments = async () => {
    console.log('Fetching documents...')
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Fetched data:', data)
    if (error) throw error
    return data as Document[]
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['rag-documents'],
    queryFn: fetchDocuments
  })

  console.log('Hook data:', data)

  return {
    documents: data || [],
    isLoading,
    error
  }
}