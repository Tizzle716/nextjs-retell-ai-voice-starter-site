export interface DatabaseDocument {
  id: string
  contact_id: string
  type: string
  name: string
  url: string
  uploaded_at: string
  created_at: string
  updated_at: string
}

export interface DocumentUploadRequest {
  file: File
  metadata?: {
    contentType?: string
    lastModified?: string
  }
}

export interface DocumentResponse extends DatabaseDocument {
  status: 'success' | 'error'
  message?: string
}

export type DocumentCategory = 'contract' | 'invoice' | 'proposal' | 'other'