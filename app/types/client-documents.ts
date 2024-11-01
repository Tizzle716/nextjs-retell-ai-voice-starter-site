// Types de base
export type DocumentType = 'contract' | 'invoice' | 'proposal' | 'other'

// Interface principale pour les documents clients
export interface ClientDocument {
  id: string
  contact_id: string
  name: string
  type: DocumentType
  url: string
  uploadedAt: string
  created_at: string
  updated_at: string
}

// Type pour les requêtes d'upload
export interface ClientDocumentUploadRequest {
  contact_id: string
  name: string
  type: DocumentType
  file: File
}

// Type pour les réponses d'API
export interface ClientDocumentResponse {
  status: 'success' | 'error'
  document?: ClientDocument
  message?: string
}

// Utilitaires de formatage
export const documentFormatters = {
  formatDate: (date: string): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date))
  },

  formatDocumentType: (type: DocumentType): string => {
    const typeMap: Record<DocumentType, string> = {
      'contract': 'Contrat',
      'invoice': 'Facture',
      'proposal': 'Proposition',
      'other': 'Autre'
    }
    return typeMap[type] || type
  }
}