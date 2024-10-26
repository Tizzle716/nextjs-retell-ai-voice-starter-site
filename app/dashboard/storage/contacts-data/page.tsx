"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useContactsData } from "@/hooks/use-contacts-data"

interface ContactData extends Record<string, unknown> {
  id: string
  name: string
  email: string
  phone: string
  lastInteraction: string
}

const columns: { key: keyof ContactData; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "lastInteraction", label: "Last Interaction" },
]

export default function ContactsDataPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContactData | null>(null)
  const { data: contactsData, isLoading, error } = useContactsData()

  const handleView = (item: ContactData) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts Data</h1>
        <Button>Add Contact Data</Button>
      </div>
      <DataTable<ContactData>
        data={contactsData}
        columns={columns}
        onView={handleView}
      />
      {selectedItem && (
        <ViewModal<ContactData>
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  )
}
