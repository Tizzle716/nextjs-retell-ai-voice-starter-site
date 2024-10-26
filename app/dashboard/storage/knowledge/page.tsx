"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useKnowledgeItems } from "@/hooks/use-knowledge-items"

interface KnowledgeItem extends Record<string, unknown> {
  id: string
  title: string
  description: string
  createdAt: string
  size: string
}

const columns: { key: keyof KnowledgeItem; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "createdAt", label: "Created At" },
  { key: "size", label: "Size" },
]

export default function KnowledgePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const { data: knowledgeItems, isLoading, error } = useKnowledgeItems()

  const handleView = (item: KnowledgeItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Knowledge</h1>
        <Button>Add Knowledge</Button>
      </div>
      <DataTable<KnowledgeItem>
        data={knowledgeItems}
        columns={columns}
        onView={handleView}
      />
      {selectedItem && (
        <ViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  )
}
