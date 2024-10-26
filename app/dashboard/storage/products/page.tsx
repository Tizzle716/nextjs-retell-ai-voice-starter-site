"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useProducts } from "@/hooks/use-products"

interface Product extends Record<string, unknown> {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
}

const columns: { key: keyof Product; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
];

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>
      <DataTable<Product>
        data={products}
        columns={columns}
        onView={handleView}
      />
      {selectedItem && (
        <ViewModal<Product>
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  )
}
