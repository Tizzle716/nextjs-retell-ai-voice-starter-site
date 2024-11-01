import useSWR from 'swr'
import { createClient } from '@/utils/supabase/client'
import { ClientDocument, ClientDocumentUploadRequest } from '@/app/types/client-documents'

const supabase = createClient()

export function useContactsData() {
  const { data: contacts, error: contactsError, mutate: mutateContacts } = useSWR(
    'contacts',
    async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          client_documents (
            id,
            name,
            type,
            url,
            uploaded_at
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  )

  const uploadDocument = async (contactId: string, file: File, metadata: Partial<ClientDocumentUploadRequest>) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${contactId}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('client_documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('client_documents')
        .getPublicUrl(filePath)

      const { error: documentError } = await supabase
        .from('client_documents')
        .insert({
          contact_id: contactId,
          name: metadata.name,
          type: metadata.type,
          url: publicUrl
        })

      if (documentError) throw documentError

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
