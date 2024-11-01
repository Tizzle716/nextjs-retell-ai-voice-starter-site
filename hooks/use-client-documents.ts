import { UseClientDocumentsReturn } from '@/app/types/client-profile'
import { ClientDocument } from '@/app/types/client-documents'
import { createClient } from '@/utils/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useClientDocuments(clientId: string): UseClientDocumentsReturn {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const fetchDocuments = async (): Promise<ClientDocument[]> => {
    const { data, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('contact_id', clientId)

    if (error) throw error

    return data.map(doc => ({
      id: doc.id,
      contact_id: doc.contact_id,
      name: doc.name,
      type: doc.type,
      url: doc.url,
      uploadedAt: doc.uploaded_at,
      created_at: doc.created_at,
      updated_at: doc.updated_at
    })) as unknown as ClientDocument[]
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['client-documents', clientId],
    queryFn: fetchDocuments,
    enabled: !!clientId
  })

  const uploadDocument = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contact_id', clientId)

      const response = await fetch('/api/client-documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-documents', clientId]
      })
    }
  })

  const deleteDocument = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('client_documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['client-documents', clientId]
      })
    }
  })

  return {
    documents: data || [],
    isLoading,
    error,
    uploadDocument: (file: File) => uploadDocument.mutateAsync(file),
    deleteDocument: (id: string) => deleteDocument.mutateAsync(id)
  }
} 