import useSWR from 'swr'
import { Document } from '@/app/types/document'
import { createClient } from '@/utils/supabase/client'

export function useDocuments() {
  const supabase = createClient()

  const fetcher = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Document[]
  }

  const { data, error, mutate } = useSWR('documents', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate
  }
}