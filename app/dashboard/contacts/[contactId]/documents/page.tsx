"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatters, type ClientDocument } from "@/app/types/client-profile"
import { UploadDocumentForm } from "./upload-document-form"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Row } from "@tanstack/react-table"

async function fetchClientDocuments(contactId: string): Promise<ClientDocument[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('client_documents')
    .select(`
      id,
      name,
      type,
      size,
      uploadedAt:created_at,
      url,
      metadata
    `)
    .eq('contact_id', contactId)

  if (error) throw error
  return data.map(doc => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    uploadedAt: doc.uploadedAt,
    url: doc.url,
    metadata: doc.metadata
  }))
}

interface FormValues {
  title: string
  category: string
  file: File
  subcategory?: string
  contact_id: string
}

export default function ClientDocumentsPage({ 
  params 
}: { 
  params: { contactId: string } 
}) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['client-documents', params.contactId],
    queryFn: () => fetchClientDocuments(params.contactId)
  })

  const handleUpload = async (data: FormValues) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value)
        } else if (value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const response = await fetch('/api/client-documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      await refetch()
      setIsUploadModalOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }: { row: Row<ClientDocument> }) => 
        formatters.formatFileSize(row.getValue("size") || 0),
    },
    {
      accessorKey: "uploadedAt",
      header: "Upload Date",
      cell: ({ row }: { row: Row<ClientDocument> }) => 
        formatters.formatDate(row.getValue("uploadedAt")),
    },
  ]

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Client Documents</h1>
        <Button onClick={() => setIsUploadModalOpen(true)}>
          Upload Document
        </Button>
      </div>

      <DataTable
        data={documents || []}
        columns={columns}
      />

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <UploadDocumentForm
            contactId={params.contactId}
            onSubmit={handleUpload}
            onCancel={() => setIsUploadModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 