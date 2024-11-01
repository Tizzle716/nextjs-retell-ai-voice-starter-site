import { UseClientDocumentsReturn, ClientDocument } from '@/app/types/client-profile'
import { DatabaseDocument } from '@/app/types/documents'
import { createClient } from '@/utils/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useClientDocuments(clientId: string): UseClientDocumentsReturn {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('contact_id', clientId)

    if (error) throw error

    return (data as DatabaseDocument[]).map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: 0,
      uploadedAt: doc.created_at,
      metadata: {
        contentType: doc.type,
        lastModified: doc.updated_at
      }
    })) as ClientDocument[]
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