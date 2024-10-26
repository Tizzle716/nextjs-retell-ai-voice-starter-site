"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useKnowledgeItems } from "@/hooks/use-knowledge-items"
import { ColumnDef } from "@tanstack/react-table"

interface KnowledgeItem extends Record<string, unknown> {
  id: string
  title: string
  description: string
  createdAt: string
  size: string
}

const columns: ColumnDef<KnowledgeItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
]

export default function KnowledgePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const { data: knowledgeItems, isLoading, error } = useKnowledgeItems()

  const handleView = (item: KnowledgeItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const renderContent = (item: KnowledgeItem | null) => (
    <div>
      <p><strong>Title:</strong> {item?.title}</p>
      <p><strong>Description:</strong> {item?.description}</p>
      <p><strong>Created At:</strong> {item?.createdAt}</p>
      <p><strong>Size:</strong> {item?.size}</p>
    </div>
  )

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
          renderContent={renderContent}
        />
      )}
    </div>
  )
}
