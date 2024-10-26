"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useScripts } from "@/hooks/use-scripts"

interface Script extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  author: string;
}

const columns: { key: keyof Script; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "lastModified", label: "Last Modified" },
  { key: "author", label: "Author" },
];

export default function ScriptsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Script | null>(null)
  const { data: scripts, isLoading, error } = useScripts()

  const handleView = (item: Script) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

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
      {selectedItem && (
        <ViewModal<Script>
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  )
}
