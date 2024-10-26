"use client"

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ViewModal } from "@/components/ui/view-modal"
import { useProducts } from "@/hooks/use-products"
import { ProductForm } from "./product-form"
import { Product } from "@/app/types/sales"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
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
      const price = row.original.price;
      return typeof price === 'number' 
        ? `$${price.toFixed(2)}` 
        : `$${parseFloat(price).toFixed(2) || '0.00'}`;
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
        data={products}
        columns={columns}
        onView={handleView}
      />
      <ViewModal<Product>
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedProduct}
        renderContent={(item) => (
          <ProductForm
            product={item}
            onSave={handleCloseModal}
          />
        )}
      />
    </div>
  )
}
