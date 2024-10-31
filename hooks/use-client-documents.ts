import { UseClientDocumentsReturn, ClientDocument } from '@/app/types/client-profile'
import { createClient } from '@/utils/supabase/client'

export function useClientDocuments(clientId: string): UseClientDocumentsReturn {
  const supabase = createClient()

  // Données mockées pour le développement
  const mockDocuments: ClientDocument[] = [
    {
      id: '1',
      name: 'Document exemple.pdf',
      type: 'application/pdf',
      size: 1024 * 1024, // 1MB
      uploadedAt: new Date().toISOString(),
      url: '#',
      metadata: {
        contentType: 'application/pdf',
        lastModified: new Date().toISOString()
      }
    }
  ]

  const uploadDocument = async (file: File) => {
    console.log('Upload document:', file.name)
    // Implémentation à venir
  }

  const deleteDocument = async (documentId: string) => {
    console.log('Delete document:', documentId)
    // Implémentation à venir
  }

  return {
    documents: mockDocuments,
    isLoading: false,
    error: null,
    uploadDocument,
    deleteDocument
  }
} 