"use client"

import { Product } from "@/app/types/product"
import { ProductCard } from "./product-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface ProductsListProps {
  products?: Product[];
  isLoading?: boolean;
}

export function ProductsList({ products, isLoading }: ProductsListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Aucun produit trouvé. Commencez par en créer un !
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 