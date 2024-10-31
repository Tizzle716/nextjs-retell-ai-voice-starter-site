import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'
import { Document } from '@/app/types/document'

const supabase = createClient()

export function useContactsData() {
  // Récupérer les contacts avec leurs documents
  const { data: contacts, error: contactsError, mutate: mutateContacts } = useSWR(
    'contacts',
    async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          client_documents (
            id,
            document:documents (*)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  )

  // Upload d'un document pour un contact
  const uploadDocument = async (contactId: string, file: File, metadata: Partial<Document>) => {
    try {
      // 1. Upload du fichier dans le bucket
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${contactId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Créer l'entrée dans la table documents
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          ...metadata,
          file_path: filePath,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (documentError) throw documentError

      // 3. Créer la liaison dans client_documents
      const { error: linkError } = await supabase
        .from('client_documents')
        .insert({
          contact_id: contactId,
          document_id: documentData.id
        })

      if (linkError) throw linkError

      // 4. Rafraîchir les données
      mutateContacts()
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  return {
    data: contacts,
    isLoading: !contactsError && !contacts,
    error: contactsError,
    uploadDocument
  }
}
