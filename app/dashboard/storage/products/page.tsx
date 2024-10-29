"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useProducts } from "@/hooks/use-products"
import { Product } from "@/app/types/product"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price.base
      return `$${price.toFixed(2)}`
    }
  },
  {
    accessorKey: "type",
    header: "Type",
  },
]

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Product | null>(null)
  const { data: products, isLoading, error } = useProducts()

  const handleView = (item: Product) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const renderContent = (item: Product | null) => {
    if (!item) return null;
    return (
      <div>
        <p><strong>Name:</strong> {item.title}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Price:</strong> ${item.price.base.toFixed(2)}</p>
        <p><strong>Type:</strong> {item.type}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>
      <DataTable<Product>
        data={products || []}
        columns={columns}
        onView={handleView}
      />
      <ViewModal<Product>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedItem}
        renderContent={renderContent}
      />
    </div>
  )
}
