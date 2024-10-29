"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

export function ProductsHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produits & Services</h1>
        <p className="text-muted-foreground">
          Gérez votre catalogue de produits et services
        </p>
      </div>
      <Button
        onClick={() => router.push("/dashboard/products/new")}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Nouveau Produit
      </Button>
    </div>
  )
} 