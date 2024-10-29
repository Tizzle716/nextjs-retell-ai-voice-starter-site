"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import debounce from "lodash/debounce"
import { Loader2 } from "lucide-react"

export function ProductsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    startTransition(() => {
      router.push(`/dashboard/products?${params.toString()}`)
    })
  }, [router, searchParams])

  const debouncedSearch = debounce(handleSearch, 300)

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    startTransition(() => {
      router.push(`/dashboard/products?${params.toString()}`)
    })
  }

  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Input
          placeholder="Rechercher un produit..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pr-8"
        />
        {isPending && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <Select
        onValueChange={handleCategoryChange}
        defaultValue={searchParams.get("category") || ""}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes</SelectItem>
          <SelectItem value="Renovation">Rénovation</SelectItem>
          <SelectItem value="Energy">Énergie</SelectItem>
          <SelectItem value="RealEstate">Immobilier</SelectItem>
          <SelectItem value="Coaching">Coaching</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 