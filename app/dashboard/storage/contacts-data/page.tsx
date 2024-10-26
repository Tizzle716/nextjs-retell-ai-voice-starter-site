"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useContactsData } from "@/hooks/use-contacts-data"
import { ColumnDef } from "@tanstack/react-table"

interface ContactData extends Record<string, unknown> {
  id: string
  name: string
  email: string
  phone: string
  lastInteraction: string
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
  const [selectedItem, setSelectedItem] = useState<ContactData | null>(null)
  const { data: contactsData, isLoading, error } = useContactsData()

  const handleView = (item: ContactData) => {
    setSelectedItem(item)
    setIsModalOpen(true)
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
        <Button>Add Contact Data</Button>
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
    </div>
  )
}
