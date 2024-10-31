"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useContactsData } from "@/hooks/use-contacts-data"
import { ColumnDef } from "@tanstack/react-table"
import { UploadDocumentForm } from "../../contacts/[contactId]/documents/upload-document-form"
import { useToast } from "@/hooks/use-toast"

interface ContactData extends Record<string, unknown> {
  id: string
  name: string
  email: string
  phone: string
  lastInteraction: string
}

interface FormValues {
  title: string
  category: string
  file: File
  subcategory?: string
  contact_id: string
}

const columns: ColumnDef<ContactData>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
  },
]

export default function ContactsDataPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContactData | null>(null)
  const { data: contactsData = [], isLoading, error } = useContactsData()
  const { toast } = useToast()

  const handleView = (item: ContactData) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

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

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
      setIsUploadModalOpen(false)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
      throw error
    }
  }

  const renderContent = (item: ContactData | null) => {
    if (!item) return null; // Gérer le cas où item est null
    return (
      <div>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Phone:</strong> {item.phone}</p>
        <p><strong>Last Interaction:</strong> {item.lastInteraction}</p>
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts Data</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsUploadModalOpen(true)}>
            Upload Document
          </Button>
          <Button>Add Contact Data</Button>
        </div>
      </div>
      <DataTable<ContactData>
        data={contactsData}
        columns={columns}
        onView={handleView}
      />
      <ViewModal<ContactData>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        renderContent={renderContent}
      />
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <UploadDocumentForm
            contacts={contactsData.map(contact => ({
              id: contact.id,
              name: contact.name,
              email: contact.email
            }))}
            onSubmit={handleUpload}
            onCancel={() => setIsUploadModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
