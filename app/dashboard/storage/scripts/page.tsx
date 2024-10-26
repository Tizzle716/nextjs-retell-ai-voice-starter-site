"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useScripts } from "@/hooks/use-scripts"
import { ColumnDef } from "@tanstack/react-table"

interface Script extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  author: string;
}

const columns: ColumnDef<Script>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
]

export default function ScriptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Script | null>(null)
  const { data: scripts, isLoading, error } = useScripts()

  const handleView = (item: Script) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const renderContent = (item: Script | null) => {
    if (!item) return null;
    return (
      <div>
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Type:</strong> {item.type}</p>
        <p><strong>Last Modified:</strong> {item.lastModified}</p>
        <p><strong>Author:</strong> {item.author}</p>
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scripts</h1>
        <Button>Add Script</Button>
      </div>
      <DataTable<Script>
        data={scripts}
        columns={columns}
        onView={handleView}
      />
      <ViewModal<Script>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        renderContent={renderContent}
      />
    </div>
  )
}
