"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/app/types/product"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price.base
      return `$${price.toFixed(2)}`
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
]

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { data: products, isLoading, error } = useProducts()

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>
      <DataTable
        data={products || []}
        columns={columns}
        onView={handleView}
      />
      <ViewModal<Product>
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedProduct}
        renderContent={(item) => item && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price.base.toFixed(2)}</p>
            {item.price.hasRange && item.price.range && (
              <p>Range: ${item.price.range.min} - ${item.price.range.max}</p>
            )}
            <p>Category: {item.category}</p>
            <p>Type: {item.type}</p>
            {item.tags.length > 0 && (
              <div>
                <p>Tags:</p>
                <ul className="list-disc pl-4">
                  {item.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      />
    </div>
  )
}
